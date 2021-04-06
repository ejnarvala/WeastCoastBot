const Discord = require("discord.js");
const { HttpClient } = require('../lib/http/client.js');


class CryptoWatchClient extends HttpClient {
    constructor() {
        super("https://api.cryptowat.ch")
    }

    async getSummary(symbol, exchange) {
        let path = `/markets/${exchange}/${symbol}USD/summary`;
        return await this._request(path);
    }

}

class BinanceClient extends HttpClient {
    constructor() {
        super("https://api.binance.com/api/v3")
    }

    async getSummary(symbol) {
        let path = `/ticker/24hr?symbol=${symbol}USDT`
        return await this._request(path)
    }

}

class OneDaySummary {

    constructor(symbol, exchange, lastPrice, highPrice, lowPrice, percentChange, absoluteChange, volume) {
        this.symbol = symbol;
        this.exchange = exchange;
        this.lastPrice = lastPrice;
        this.highPrice = highPrice;
        this.lowPrice = lowPrice;
        this.percentChange = percentChange;
        this.absoluteChange = absoluteChange;
        this.volume = volume;
    }

    static fromCryptoWatchSummary(symbol, exchange, cryptoWatchSummary) {
        let result = cryptoWatchSummary.result;
        let lastPrice = result.price.last;
        let highPrice = result.price.high;
        let lowPrice = result.price.low;
        let percentChange = result.price.change.percentage;
        let absoluteChange = result.price.change.absolute;
        let volume = result.volume;
        return new OneDaySummary(symbol, exchange, lastPrice, highPrice, lowPrice, percentChange, absoluteChange, volume);
    }

    static fromBinanceSummary(symbol, binanceSummary) {
        let exchange = "binance";
        let lastPrice = parseFloat(binanceSummary.lastPrice);
        let highPrice = parseFloat(binanceSummary.highPrice);
        let lowPrice = parseFloat(binanceSummary.lowPrice);
        let percentChange = parseFloat(binanceSummary.priceChangePercent) / 100;
        let absoluteChange = parseFloat(binanceSummary.priceChange);
        let volume = parseFloat(binanceSummary.volume);
        return new OneDaySummary(symbol, exchange, lastPrice, highPrice, lowPrice, percentChange, absoluteChange, volume);
    }

    formatPrice = (price) => `${price < 0 ? '-' : ''}$${Math.abs(price).toFixed(2)}`;
    formatPercent = (percent) => `${(percent * 100).toFixed(2)}%`;
    
    toEmbed() {
        return new Discord.MessageEmbed()
            .setTitle(this.symbol.toUpperCase())
            .setThumbnail(`https://icons.bitbot.tools/api/${this.symbol.toLowerCase()}/128x128`)
            .setDescription(`Price Summary over last 24hrs on ${this.exchange}`)
            .setColor((this.percentChange >= 0) ? "#6a9d51" : "#d21c38")
            .addFields(
                { name: "Last Price", value: this.formatPrice(this.lastPrice)},
                { name: "Percent Change", value: this.formatPercent(this.percentChange)},
                { name: "Absolute Change", value: this.formatPrice(this.absoluteChange)},
                { name: "High Price", value: this.formatPrice(this.highPrice)},
                { name: "Low Price", value: this.formatPrice(this.lowPrice)},
                { name: "Volume", value: this.volume.toFixed(2)})
            .setTimestamp()
    }
}

const binanceClient = new BinanceClient();
const cryptoWatchClient = new CryptoWatchClient();
const defaultExchange = "binance"
module.exports = {
    name: 'crypto',
    description: 'Crypto info lookup',
    args: true,
    usage: `<crypto ticker> [, exchange (default: ${defaultExchange})]`,
    async execute(message, args) {
        let symbol = args[0].toUpperCase();
        let exchange;
        if (args.length > 1) {
            exchange = args[1].trim().toLowerCase();
        } else {
            exchange = defaultExchange
        }

        let summary;
        if (exchange == "binance") {
            let data = await binanceClient.getSummary(symbol);
            summary = OneDaySummary.fromBinanceSummary(symbol, data);
        } else {
            let data = await cryptoWatchClient.getSummary(symbol, exchange);
            summary = OneDaySummary.fromCryptoWatchSummary(symbol, exchange, data);
        }

        if (summary) message.channel.send(summary.toEmbed())

    }
};