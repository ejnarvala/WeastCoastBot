const Discord = require("discord.js")
const { StatsService } = require("../domain/nba/StatsService.js");
const { PlayerService } = require("../domain/nba/PlayerService.js");

const statsService = new StatsService();
const playerService = new PlayerService();


class PlayerAverageStats {

    constructor(player, stats) {
        this.gamesPlayed = stats.games_played;
        this.playerId = player.id;
        this.stats = stats;
        this.player = player;
    }


    toEmbed = () => new Discord.MessageEmbed()
        .setTitle(`${this.player.first_name} ${this.player.last_name}`)
        .setThumbnail(`https://nba-players.herokuapp.com/players/${this.player.last_name}/${this.player.first_name}`)
        .addFields(
            ...Object.entries(this.stats).map((entry) => Object.fromEntries(
                [
                    ['name', entry[0]], 
                    ['value', entry[1]],
                    ['inline', true]
                ]
            )))
        .setTimestamp()
}



module.exports = {
    name: "stats",
    description: "Player stats",
    args: true,
    usage: "<player name> [, time frame]",
    async execute(message, args) {
        let player = await playerService.getPlayer(args[0]);
        let averages = await statsService.getPlayerAverageStats(player.id);
        console.log(averages);
        let playerStats = new PlayerAverageStats(player, averages);
        message.channel.send(playerStats.toEmbed());
    }
}