const chrono = require('chrono-node');
const db = require("../db/models/index");

getReminderTime = (parseText) => {
    let results = chrono.parse(parseText);
    if (!results.length) throw `Sorry couldn't figure out '${parseText}'`;
    return results[0].start.date();
}

createReminder = async (userId, channelId, messageId, remindTime, message) => {
    let newReminder = await db.Reminder.create({
        userId: userId,
        channelId: channelId,
        messageId: messageId,
        remindTime: remindTime,
        message: message
    })
    console.log(`Created reminder with id: ${newReminder.id}`);
}


module.exports = {
    name: 'remindme',
    description: 'Set reminders',
    args: true,
    usage: `<date/time to remind>`,
    async execute(message, args) {
        let reminderTime = getReminderTime(args[0]);
        let remindMessage = `Reminder from ${message.createdAt.toLocaleString()}`;
        if (args.length > 1) {
            remindMessage = args[1].trim();
        }
        let channelId = message.channel.id;
        let userId = message.author.id;
        let messageId = message.id;

        await createReminder(userId, channelId, messageId, reminderTime, remindMessage);

        message.reply(`Reminder set for ~${reminderTime.toLocaleString()} \n>${remindMessage}`);
    }
};