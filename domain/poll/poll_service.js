const icons = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']

class PollOption {
    constructor({name, index}) {
        this.name = name;
        this.index = index;
    }
}


class Poll {
    question = "";
    options = [];

    constructor(question, optionNames) {
        this.question = question;
        if (optionNames.length) {
            this.options = optionNames.map(
                (name, index) => new PollOption({name: name, index: index}));
        } else {
            this.options = [
                new PollOption({name: "Yes", index: 0}),
                new PollOption({name: "No", index: 1})
            ];
        }
    }
}

class PollService {
    static iconFromIndex = (index) => icons[index];

    static validIcon = (icon, numOptions) => {
        for (let i = 0; i < numOptions; i++) {
            if (icons[i] == icon) return true;
        }
        return false;
    };
    
    static getIndexFromIcon = (icon) => {
        return icons.indexOf(icon);
    }
}


module.exports = {
    PollService: PollService,
    Poll: Poll
}
