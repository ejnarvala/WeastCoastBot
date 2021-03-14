const { HttpClient } = require("../http/client");

class BallDontLieClient extends HttpClient {
    constructor() {
        super("https://www.balldontlie.io/api/v1")
    }

    request = async (path, params) => {
        let resp = await this._request(path + `?per_page=100&${params.join('&')}`);
        return (resp.meta == undefined && resp.data != undefined) ? resp : resp.data;
    }

    getPlayer = async (id) => await this.request(`/players/${id}`);

    getPlayers= async (searchTerm) => await this.request("/players", this.makeQueryParams({search = searchTerm}));

    getTeams = async () => await this.request("/teams");

    getTeam = async (id) => await this.request(`/teams/${id}`);

    getGames = async (options) => await this.request("/games", this.makeQueryParams(options));

    getGame = async (id) => await this.request(`/games/${id}`);

    getStats = async (options) => await this.request("/games", this.makeQueryParams(options));

    getSeasonAverages = async (options) => await this .request("/season_averages", this.makeQueryParams(options));

    makeQueryParams(options) {
        let queryParams = [];
        if (options.search) queryParams.push(`search=${options.search}`)
        if (options.dates) queryParams.concat(options.dates.map((date) => `dates[]=${this.formatDate(date)}`));
        if (options.seasons) queryParams.concat(options.seasons.map(season => `seasons[]=${season}`));
        if (options.season) queryParams.push(`season=${options.season}`);
        if (options.playerIds) queryParams.concat(options.playerIds.map((playerId) => `player_ids[]=${playerId}`));
        if (options.gameIds) queryParams.concat(options.gameIds.map((gameId) => `game_ids[]=${gameId}`));
        if (options.isPostSeason) queryParams.push(`postseason=${options.isPostSeason}`);
        if (options.startDate) queryParams.push(`start_date=${this.formatDate(options.startDate)}`);
        if (options.endDate) queryParams.push(`end_date=${this.formatDate(options.endDate)}`);
        return queryParams;
    }

    formatDate = (date) => date.toISOString().split('T')[0];
};

module.exports = {
    BallDontLieClient: BallDontLieClient
}