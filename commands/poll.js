const { PollService, Poll } = require('./domain/poll/poll_service.js');
const Discord = require("discord.js")

const questionPrefix = "Poll: ";
const pollTimeoutMs = 600000;

const validateArgs = (args) => {
    if (args.length > 10) throw "Cannot have more than 10 options.";
}

const optionValue = (votes) => `${votes} Vote${votes == 1 ? '' : 's'}`;

const setNewScore = (reaction) => {
    let currentEmbed = reaction.message.embeds[0]
    let numVotes = reaction.count - 1;
    let newValue = optionValue(numVotes);
    let fieldIndex = PollService.getIndexFromIcon(reaction.emoji.name);
    let changedEmbed = new Discord.MessageEmbed(currentEmbed);
    changedEmbed.fields[fieldIndex].value = newValue;
    reaction.message.edit(changedEmbed);
}


class PollResponse {
    poll;

    constructor(poll) {
        this.poll = poll;
    }

    toEmbed() {
        let embed = new Discord.MessageEmbed()
        .setTitle(questionPrefix + this.poll.question)
        .setFooter(`This poll will end in ${pollTimeoutMs / 60000} minutes`)
        .setTimestamp();

        for (const option of this.poll.options) {
            let name = `${PollService.iconFromIndex(option.index)} ${option.name}`;
            let value = optionValue(0);
            embed.addField(name, value);
        }
        return embed;
    }

}


module.exports = {
    name: 'poll',
    description: 'Create polls voted on by reactions',
    usage: `<question>, [<option 1>, <option 2>, ...]`,
    args: true,
    async execute(message, args) {
        args = args.join(' ').split(',');
        try {
            validateArgs(args)
        } catch (error) {
            message.reply(error);
            return;
        }

        let question = args[0];
        let optionNames = args.length > 1 ? args.slice(1) : [];

        let poll = new Poll(question, optionNames);
        let embed = new PollResponse(poll).toEmbed();
        let sentEmbed = await message.channel.send(embed);

        for (const option of poll.options) {
            let emoji = PollService.iconFromIndex(option.index);
            await sentEmbed.react(emoji);
        }
        
        var filter = (reaction) => {
            let icon = reaction.emoji.name;
            let numOptions = poll.options.length;
            return PollService.validIcon(icon, numOptions);
        }

        const collector = sentEmbed.createReactionCollector(filter, { time: pollTimeoutMs, dispose: true});
        collector.on('collect', (reaction) => setNewScore(reaction));
        collector.on('remove', (reaction) => setNewScore(reaction));
    }
};