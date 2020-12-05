require("dotenv").config()
const fs = require('fs');
const { prefix } = require('./config.json')
const Discord = require("discord.js")

// regex
const reWordIsOver = /\w+ *(i*'*s|are) *over/
const reIsOver = / *(i*'*s|are) *over/
const rePopWithoutSmoke = /\bpop(?!.*smoke)/


const client = new Discord.Client()


client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}


// message handler
client.on("message", message => {
    if (message.author.bot) return;

    // command handler
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    if (client.commands.has(commandName)) {
        const command = client.commands.get(commandName);
    
        if (command.guildOnly && message.channel.type === 'dm') {
            return message.reply('I can\'t execute that command inside DMs!');
        }
    
        if (command.args && !args.length) {
            let reply = "You didn't provide any arguments."
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
    } else { 
        // non-command based code:
        if (reWordIsOver.test(message.content)) {
            startIdx = message.content.search(reWordIsOver)
            endIdx = message.content.search(reIsOver)
            let thing = message.content.substring(startIdx, endIdx)
            let reply = `:warning: '${thing}' may not actually be over`
            message.reply(reply)
        }
        
        if (rePopWithoutSmoke.test(message.content)) {
            message.reply("You cannot say pop and forget the smoke :triumph:")
        }

        if (message.content.trim().toLowerCase() == "bad bot") {
            message.reply("I'll try to be better :smiling_face_with_tear:");
        }
    
        if (message.content.trim().toLowerCase() == "good bot") {
            message.reply("Thanks human :slight_smile:")
        }
    
    }

});

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
});

client.login(process.env.BOT_TOKEN)
