var CronJob = require('cron').CronJob;
const fs = require('fs');

const queueWorkerFiles = fs.readdirSync('./cron/jobs').filter(file => file.endsWith('.js'));
var jobs = queueWorkerFiles.map( (file) => require(`./jobs/${file}`));

for (const job of jobs) {
    let cronJob = new CronJob(job.schedule, job.execute);
    cronJob.start();
}