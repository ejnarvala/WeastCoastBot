const { BallDontLieClient } = require("../../lib/balldontlie/BallDontLieClient.js");

const client = new BallDontLieClient();

class PlayerService {
    getPlayer = async (playerName) => (await client.getPlayers(playerName))[0];
}


module.exports = {
    PlayerService: PlayerService
}