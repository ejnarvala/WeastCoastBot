const { Op } = require("sequelize");
const db = require('../../db/models/index.js');
const reminder = require("../../db/models/reminder.js");

const checkForReminders = async (client) => {

    let reminders = await db.Reminder.findAll({
        where: {
            remindTime: {
                [Op.lte]: new Date()
            }
        }
    });
    for (let reminder of reminders) {
        let channel = await client.channels.fetch(reminder.channelId);
        channel.messages.fetch(reminder.messageId)
            .then(message => message.reply(`\n > ${reminder.message}`))
            .catch(_ => {
                channel.send(`Hey <@${reminder.userId}>, just reminding you about: \n> ${reminder.message}`);
            })
        reminder.destroy();
    }
}

module.exports = checkForReminders