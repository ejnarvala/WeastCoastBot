require("dotenv").config()
const Discord = require("discord.js")
const client = new Discord.Client()
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

const re = /\w+ is over/

client.on("message", msg => {
    if (msg.author.bot) return

    if (msg.content == 'wcb-ping') {
        msg.reply('pong!')
    }

    if (re.test(msg.content)) {
        console.log('message from ' + msg.author + 'flagged')
        startIdx = msg.content.search(re)
        endIdx = msg.content.search(' is over')
        let thing = msg.content.substring(startIdx, endIdx)
        let reply = '[Fake News Warning]: ' + thing + ' may not actually be over'
        msg.reply(reply)
    }
})

client.login(process.env.BOT_TOKEN)