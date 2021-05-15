const checkForReminders = require("../../domain/reminders/reminders.js");

module.exports = {
    schedule: '*/10 * * * * *',
    execute: checkForReminders
}