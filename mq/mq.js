const amqp = require('amqplib/callback_api');
const fs = require('fs');

const queueWorkerFiles = fs.readdirSync('./mq/workers').filter(file => file.endsWith('.js'));
var workers = queueWorkerFiles.map( (file) => require(`./workers/${file}`));

amqp.connect(process.env.CLOUDAMQP_URL, (err0, connection) => {
  if (err0) throw error0;
  for (const worker of workers) {
      connection.createChannel((err, channel) => {
          if (err) throw err;
          channel.assertQueue(worker.queueName, { durable: true });
          channel.prefetch(1);
          console.log(`Starting worker for queue ${worker.queueName}`);
          channel.consume(worker.queueName, (msg) => worker.execute(msg, channel), worker.options);
      });
  }
});