require("dotenv").config()
const Discord = require("discord.js")
const fetch = require("node-fetch");

const makeSearchUrl = (term) => `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_SECRET}&t=${term}`;

const makeEmbedFromSearchResponse = (response) => {
    return new Discord.MessageEmbed()
    .setTitle(response.Title)
    .setURL(`https://www.imdb.com/title/${response.imdbID}`)
    .setImage(response.Poster)
    .addFields(
        { name: "Released", value: response.Released, inline: true},
        { name: "Genre", value: response.Genre, inline: true},
        { name: "Director", value: response.Director, inline: true },
        { name: "Actors", value: response.Actors, inline: true },
        { name: "Writer", value: response.Writer, inline: true },
        { name: "Runtime", value: response.Runtime, inline: true },
        { name: "IMDB ID", value: response.imdbID, inline: true },
        { name: "IMDB Rating", value: response.imdbRating, inline: true }
    )
    .setDescription(response.Plot)
}

module.exports = {
    name: 'imdb',
    description: 'Look up IMDB movies',
    args: true,
    usage: `<search term>`,
    async execute(message, args) {
        let searchTerm = args.join(' ');
        let response = await fetch(makeSearchUrl(searchTerm));
        let responseJson = await response.json();
        if (responseJson.Response == 'False') return;
        let embed = makeEmbedFromSearchResponse(responseJson);
        message.channel.send(embed);
    }
};