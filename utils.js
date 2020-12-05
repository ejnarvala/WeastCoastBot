const Discord = require("discord.js")


const formatPrice = (price) => {
    let output = `$${Math.abs(price).toFixed(2)}`;
    if (price < 0) {
        output = '-' + output
    }
    return output
};

const formatPercent = (percent) => `${percent.toFixed(2)}%`;

const stockUpImage = "https://i.redd.it/award_images/t5_22cerq/s5edqq9abef41_StonksRising.png";
const stockDownImage = "https://i.redd.it/award_images/t5_22cerq/ree13odobef41_StonksFalling.png"

function messageFromQuote(quote) {
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
            // { name: 'Last Open', value: formatPrice(priceData.regularMarketOpen), inline: true }, 
            // { name: 'Last Close', value: formatPrice(priceData.regularMarketPreviousClose), inline: true },
            { name: 'Market Change', value: formatPrice(priceData.regularMarketChange) },
            { name: 'Percent Market Change', value: formatPercent(priceData.regularMarketChangePercent) })
        // .setFooter("Data by Yahoo Finance")
        .setFooter(priceData.quoteSourceName)
        .setTimestamp()
}
 

module.exports = { messageFromQuote }