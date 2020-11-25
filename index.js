require("dotenv").config()
const fetch = require("node-fetch");
const Discord = require("discord.js")
var yahooFinance = require('yahoo-finance');

const utils = require('./utils');

const client = new Discord.Client()
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

const wikiCmd = "/wiki"
const wiki_search_url = "https://en.wikipedia.org/w/api.php?action=opensearch&limit=1&namespace=0&format=json&search="

const reWordIsOver = /\w+ *(i*'s|are) *over/
const reIsOver = / *(i*'*s|are) *over/

const rePopWithoutSmoke = /\bpop(?!.*smoke)/

const stockCmd = "/stonk"
const ticker_search_url = "http://d.yimg.com/aq/autoc?region=US&lang=en-US&query="

client.on("message", msg => {
    if (msg.author.bot) return

    if (msg.content == '/ping') {
        msg.reply('pong!')
    }

    if (reWordIsOver.test(msg.content)) {
        startIdx = msg.content.search(reWordIsOver)
        endIdx = msg.content.search(reIsOver)
        let thing = msg.content.substring(startIdx, endIdx)
        let reply = '[Fake News Warning]: ' + thing + ' may not actually be over'
        msg.reply(reply)
    }

    if (msg.content.startsWith(wikiCmd) & msg.content.length > wikiCmd.length) {
        let term = msg.content.substr(wikiCmd.length).trim()
        let search = wiki_search_url + term
        fetch(search)
        .then(response => response.json())
        .then(data => msg.channel.send(data[3][0]))
    }

    if (msg.content.startsWith(stockCmd) & msg.content.length > wikiCmd.length) {
        let term = msg.content.substring(stockCmd.length).trim()
        if (term.length <= 5) {
            yahooFinance.quote(term, ['price'])
            .then(quote => {
                msg.channel.send(utils.messageFromQuote(quote));
            })
        } else {
            fetch(ticker_search_url + term)
            .then(resp => resp.json())
            .then(data => {
                let results = data.ResultSet.Result;
                if (results.length) {
                    let symbol = results[0].symbol;
                    yahooFinance.quote(symbol, ['price'])
                    .then(quote => {
                        msg.channel.send(utils.messageFromQuote(quote));
                    })
                }
            })    
        }
    }

    if (msg.content.trim().toLowerCase() == "bad bot") {
        msg.reply("I'm sorry :(");
    }

    if (msg.content.trim().toLowerCase() == "good bot" && !msg.author.bot) {
        msg.reply("Good human :)")
    }

    if (rePopWithoutSmoke.test(msg.content)) {
        msg.reply("You cannot say pop and forget the smoke.")
    }

})

client.login(process.env.BOT_TOKEN)
