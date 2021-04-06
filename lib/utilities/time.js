const chrono = require('chrono-node');


const parseDateRange = (text) => {
    let results = chrono.parse(text, new Date(), { forwardDate: false })[0];
    let start, end;
    start = results.start.date();
    if (results.end) {
        end = results.end.date();
    }
    return [start, end];
}

const parseDate = (text) => chrono.parseDate(text);


module.exports = {
    parseDateRange: parseDateRange,
    parseDate: parseDate
}