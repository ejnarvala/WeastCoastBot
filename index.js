require("dotenv").config()
const fetch = require("node-fetch");
const Discord = require("discord.js")
const client = new Discord.Client()
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

const reWordIsOver = /\w+ *i*'s *over/
const reIsOver = / *i*'s *over/

const wikiCmd = "/wiki"
const wiki_search_url = "https://en.wikipedia.org/w/api.php?action=opensearch&limit=1&namespace=0&format=json&search="

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

    if (msg.content.startsWith(wikiCmd) & msg.content.length > wikiCmd.length) {
        let term = msg.content.substr(wikiCmd.length)
        let search = wiki_search_url + term
        console.log("TERM: " + term)
        console.log("SEARCH_URL: " + search)
        fetch(search)
            .then(response => response.json())
            .then(data => msg.channel.send(data[3][0]))
    }
})

client.login(process.env.BOT_TOKEN)