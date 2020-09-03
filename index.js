require("dotenv").config()
const Discord = require("discord.js")
const client = new Discord.Client()
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

const reWordIsOver = /\w+ *(i*s|are) *over/
const reIsOver = / *(i*s|are) *over/

client.on("message", msg => {
    if (msg.author.bot) return

    if (msg.content == 'wcb-ping') {
        msg.reply('pong!')
    }

    if (reWordIsOver.test(msg.content)) {
        console.log('message from ' + msg.author.username + ' flagged')
        startIdx = msg.content.search(reWordIsOver)
        endIdx = msg.content.search(reIsOver)
        let thing = msg.content.substring(startIdx, endIdx)
        let reply = '[Fake News Warning]: ' + thing + ' may not actually be over'
        msg.reply(reply)
    }
})

client.login(process.env.BOT_TOKEN)
