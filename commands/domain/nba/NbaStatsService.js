const { BallDontLieClient } = require("../../lib/balldontlie/BallDontLieClient.js");


const currentSeason = (new Date()).getMonth >= 7 ? (new Date()).getFullYear() : (new Date()).getFullYear() - 1;

class NbaStatsService {
    getPlayersStats({playerIds, isPostSeason, seasons = [currentSeason], startDate, endDate, dates}) {
        
    };
}

module.exports = {
    name: stats,
    async execute(message, args) {

    }
}