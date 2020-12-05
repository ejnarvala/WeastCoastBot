const fetch = require("node-fetch");
const wiki_search_url = "https://en.wikipedia.org/w/api.php?action=opensearch&limit=1&namespace=0&format=json&search="

module.exports = {
    name: 'wiki',
    description: 'Wikipedia link lookup',
    args: true,
    usage: '<search term>',
    execute(message, args) {
        let search = wiki_search_url + args.join(' ');
        fetch(search)
        .then(response => response.json())
        .then(data => message.channel.send(data[3][0]))
    }
};