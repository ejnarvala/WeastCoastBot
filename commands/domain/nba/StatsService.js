const { BallDontLieClient } = require("../../lib/balldontlie/BallDontLieClient.js");
const { PlayerService } = require("../nba/PlayerService.js");

const currentSeason = (new Date()).getMonth >= 7 ? (new Date()).getFullYear() : (new Date()).getFullYear() - 1;

const client = new BallDontLieClient();
const playerService = new PlayerService();

class StatsService {
    async getPlayerAverageStats(playerId, startDate, endDate) {
        let options = {playerIds: [playerId]};
        
        let averages;
        if (endDate) {
            if (startDate) {
                options.startDate = startDate;
                options.endDate = endDate;
            } else {
                options.dates = [endDate];
            }
            let stats = await client.getStats(options);
            averages = this.averagePlayerStats(stats);
        } else {
            averages = (await client.getSeasonAverages(options))[0];
        }
        return averages;
    };


    averagePlayerStats(stats) {
        let initialStats = {
            fgm: 0,
            fga: 0,
            fg3m: 0,
            fg3a: 0,
            ftm: 0,
            fta: 0,
            dreb: 0,
            oreb: 0,
            reb: 0,
            ast: 0,
            stl: 0,
            blk: 0,
            turnover: 0,
            pts: 0,
            fg_pct: 0,
            fg3_pct: 0,
            ft_pct: 0
        }
        let totals = stats.reduce((totals, next) => {
            for (key of Object.keys(totals)) {
                totals[key] += next[key]
            }
        }, initialStats);

        let averages = {};
        for (key of Object.keys(totals)) {
            averages[key] = totals[key] / stats.length;
        }
        averages.games_played = stats.length;
        return averages;
    }
}

module.exports = {
    StatsService: StatsService
}