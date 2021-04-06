const Discord = require("discord.js")
const fs = require('fs');


const commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/nba').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./nba/${file}`);
    commands.set(command.name, command);
}


module.exports = {
    name: 'nba',
    description: 'Look up NBA stats',
    args: true,
    usage: `<command (stats)> [, args]`,
    async execute(message, args) {
        let splitArg = args[0].split(' ');
        let commandName = splitArg.shift().toLowerCase().trim();
        args[0] = splitArg.join(' ').trim();
        console.log(`COMMAND: ${commandName}, ARGS: ${args}`);
        if (commands.has(commandName)) {
            const command = commands.get(commandName);
            if (command.args && !args.length) {
                let reply = "You didn't provide any arguments.";
                if (command.usage) {
                    reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
                }
                return message.reply(reply);
            }

            try {
                command.execute(message, args);
            } catch (error) {
                console.error(error);
            }
        }
    }
};