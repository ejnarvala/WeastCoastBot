const Discord = require("discord.js")
const fetch = require("node-fetch");
const yahooFinance = require('yahoo-finance');

const ticker_search_url = "http://d.yimg.com/aq/autoc?region=US&lang=en-US&query="

const stockUpImage = "https://i.redd.it/award_images/t5_22cerq/s5edqq9abef41_StonksRising.png";
const stockDownImage = "https://i.redd.it/award_images/t5_22cerq/ree13odobef41_StonksFalling.png"

const formatPrice = (price) => `${price < 0 ? '-' : ''}$${Math.abs(price).toFixed(2)}`;
const formatPercent = (percent) => `${percent.toFixed(2)}%`;

const responseFromQuote = (quote) => {
    let priceData = quote.price;
    let summary = quote.summaryProfile;
    let priceUp = priceData.regularMarketChange > 0;
    return new Discord.MessageEmbed()
        .setTitle(priceData.shortName + " (" + priceData.symbol + ")")
        .setDescription(`Industry: ${summary.industry}`)
        .setURL(`https://finance.yahoo.com/quote/${priceData.symbol}`)
        .setColor(priceUp ? "#6a9d51" : "#d21c38")
        .setThumbnail(priceUp ? stockUpImage :stockDownImage )
        .addFields(
            { name: 'Market Price', value: formatPrice(priceData.regularMarketPrice) }, 
            { name: 'Day Low', value: formatPrice(priceData.regularMarketDayLow), inline: true }, 
            { name: 'Day High', value: formatPrice(priceData.regularMarketDayHigh), inline: true}, 
            { name: 'Market Change', value: formatPrice(priceData.regularMarketChange) },
            { name: 'Percent Market Change', value: formatPercent(priceData.regularMarketChangePercent) })
        .setFooter(priceData.quoteSourceName)
        .setTimestamp()
};

const getQuoteFromSymbol = async symbol => await yahooFinance.quote(symbol, ['price', 'summaryProfile']);

const lookupSymbol = async searchTerm => {
    if (searchTerm.length <= 5) {
        return searchTerm;
    }
    let response = await fetch(ticker_search_url + searchTerm);
    let data = await response.json();
    let results = data.ResultSet.Result;
    if (results.length) {
        return results[0].symbol;
    }
};

module.exports = {
    name: 'stonk',
    description: 'Stock info lookup',
    args: true,
    usage: '<ticker or search term>',
    async execute(message, args) {
        let symbol = await lookupSymbol(args.join(' '));
        let quote = await getQuoteFromSymbol(symbol)
        let response = responseFromQuote(quote);
        message.channel.send(response);
    }
};