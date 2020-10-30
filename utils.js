const Discord = require("discord.js")


function formatPrice(price) { 
    return "$" + price.toFixed(2);
}

const stockUpImage = "https://i.redd.it/award_images/t5_22cerq/s5edqq9abef41_StonksRising.png";
const stockDownImage = "https://i.redd.it/award_images/t5_22cerq/ree13odobef41_StonksFalling.png"

function messageFromQuote(quote) {
    let priceData = quote.price;
    let priceUp = priceData.regularMarketChange > 0;
    return new Discord.MessageEmbed()
        .setTitle(priceData.shortName + " (" + priceData.symbol + ")")
        .setColor(priceUp ? "#6a9d51" : "#d21c38")
        .setThumbnail(priceUp ? stockUpImage :stockDownImage )
        .addFields(
            { name: 'Market Price', value: formatPrice(priceData.regularMarketPrice) }, 
            { name: 'Day Low', value: formatPrice(priceData.regularMarketDayLow) }, 
            { name: 'Day High', value: formatPrice(priceData.regularMarketDayHigh) }, 
            { name: 'Last Open', value: formatPrice(priceData.regularMarketOpen) }, 
            { name: 'Last Close', value: formatPrice(priceData.regularMarketPreviousClose) },
            { name: 'Market Change', value: formatPrice(priceData.regularMarketChange) })
        .setFooter("Data by Yahoo Finance")
        .setTimestamp()
}


module.exports = { messageFromQuote }