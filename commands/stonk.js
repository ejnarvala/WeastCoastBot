const Discord = require("discord.js");
const chrono = require('chrono-node');
const fetch = require("node-fetch");
const yahooFinance = require('yahoo-finance');

const ticker_search_url = "http://d.yimg.com/aq/autoc?region=US&lang=en-US&query="

const stockUpImage = "https://i.redd.it/award_images/t5_22cerq/s5edqq9abef41_StonksRising.png";
const stockDownImage = "https://i.redd.it/award_images/t5_22cerq/ree13odobef41_StonksFalling.png"

const formatPrice = (price) => `${price < 0 ? '-' : ''}$${Math.abs(price).toFixed(2)}`;
const formatPercent = (percent) => `${(percent * 100).toFixed(2)}%`;

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

const responseFromHistorical = (historical) => {
    let startData = historical[0];
    let endData = historical[historical.length - 1];
    let priceDiff = endData.close - startData.open;
    let percentChange = (priceDiff / startData.open) * 100.0;
    let priceUp = priceDiff > 0;
    let symbol = startData.symbol;
    return new Discord.MessageEmbed()
        .setTitle(symbol.toUpperCase())
        .setURL(`https://finance.yahoo.com/quote/${symbol}`)
        .setColor(priceUp ? "#6a9d51" : "#d21c38")
        .setThumbnail(priceUp ? stockUpImage :stockDownImage )
        .addFields(
            { name: `Open - ${startData.date.toDateString()}`, value: formatPrice(startData.open)},
            { name: `Close - ${endData.date.toDateString()}`, value: formatPrice(endData.close)},
            { name: 'Percent Change', value: formatPercent(percentChange) })
        .setFooter(`Data by Yahoo Finance`)
        .setTimestamp()

}

const getQuoteFromSymbol = async symbol => await yahooFinance.quote(symbol, ['price', 'summaryProfile']);
const getHistoricalFromSymbolAndDates = async (symbol, dateResult) => {
    let from = dateResult.start.date();
    let to = (dateResult.end) ? dateResult.end.date() : new Date();
    return await yahooFinance.historical({symbol: symbol, from: from, to: to});
}


const lookupSymbol = async searchTerm => {
    if (searchTerm.length <= 5) {
        return searchTerm;
    }
    let response = await fetch(ticker_search_url + searchTerm);
    let data = await response.json();
    let results = data.ResultSet.Result;
    if (!results.length) {
        throw `Could not find ticker for '${searchTerm}'`;
    }
    return results[0].symbol;
};

const validDateRange = (chronoParseResults) => {
    if (chronoParseResults.length == 0) return false;
    let dateResult = chronoParseResults[0];
    let now = new Date();
    if (!dateResult.end && dateResult.start.date().toDateString() == now.toDateString()) return false;
    if (dateResult.start && dateResult.end && dateResult.start > dateResult.end) return false;;
    return true;
}

module.exports = {
    name: 'stonk',
    description: 'Stock info lookup',
    args: true,
    usage: '<ticker or search term>',
    async execute(message, args) {
        let symbol = await lookupSymbol(args[0]);
        let dateResults = [];
        if (args.length > 1) {
            dateResults = chrono.parse(args[1]);
        }
        
        let response;
        if (validDateRange(dateResults)) {
            let historical = await getHistoricalFromSymbolAndDates(symbol, dateResults[0]);
            response = responseFromHistorical(historical);
        } else {
            let quote = await getQuoteFromSymbol(symbol);
            response = responseFromQuote(quote);
        }
        message.channel.send(response);
    }
};
