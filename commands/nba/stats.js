const Discord = require("discord.js")
const { StatsService } = require("../../domain/nba/StatsService.js");
const { PlayerService } = require("../../domain/nba/PlayerService.js");
const { parseDateRange } = require("../../lib/utilities/time.js");
const { formatPercent } = require("../../lib/utilities/format.js");
const statsService = new StatsService();
const playerService = new PlayerService();


class Stats {
    constructor(stats) {
        this.stats = stats;
    }

    toEmbedFields = (inline) => [
        {name: "PTS", value: this.stats.pts, inline: inline},
        {name: "AST", value: this.stats.ast, inline: inline},
        {name: "REB", value: this.stats.dreb, inline: inline},
        {name: "FG", value: `${this.stats.fgm}/${this.stats.fga} (${formatPercent(this.stats.fg_pct)})`, inline: inline},
        {name: "3PT", value: `${this.stats.fg3m}/${this.stats.fg3a} (${formatPercent(this.stats.fg3_pct)})`, inline: inline},
        {name: "FT", value: `${this.stats.ftm}/${this.stats.fta} (${formatPercent(this.stats.ft_pct)})`, inline: inline},
        {name: "DREB", value: this.stats.dreb, inline: inline},
        {name: "OREB", value: this.stats.oreb, inline: inline},
        {name: "BLK", value: this.stats.blk, inline: inline},
        {name: "STL", value: this.stats.stl, inline: inline},
        {name: "TO", value: this.stats.turnover, inline: inline},
        {name: "GP", value: this.stats.games_played, inline: inline}
    ]
}

class PlayerAverageStats {

    constructor(player, stats, dates) {
        this.playerId = player.id;
        this.stats = new Stats(stats);
        this.player = player;
        this.dates = dates;
    }

    title = () => {
        let title = `${this.player.first_name} ${this.player.last_name}`;
        if (this.dates[0]) {
            title += ` (${this.dates[0].toLocaleDateString()}`
            if (this.dates[1]) {
                title += ` - ${this.dates[1].toLocaleDateString()})`;
            } else {
                title += ")";
            }
        } else {
            title += " (Season Average)";
        }
        return title;
    }

    toEmbed = () => new Discord.MessageEmbed()
        .setTitle(this.title())
        .setThumbnail(`https://nba-players.herokuapp.com/players/${this.player.last_name}/${this.player.first_name}`)
        .addFields(...this.stats.toEmbedFields(true))
        .setTimestamp()
}



module.exports = {
    name: "stats",
    description: "Player stats",
    args: true,
    usage: "<player name> [, time frame]",
    async execute(message, args) {
        let player = await playerService.getPlayer(args[0]);
        let startDate, endDate;
        if (args.length > 1) {
            [startDate, endDate] = parseDateRange(args[1]);
        }
        let averages = await statsService.getPlayerAverageStats(player.id, startDate, endDate);
        console.log(averages);
        let playerStats = new PlayerAverageStats(player, averages, [startDate, endDate]);
        message.channel.send(playerStats.toEmbed());
    }
}