module.exports = {
    queueName: "test",
    options: { noAck: false },
    execute(message, channel) {
        console.log(`RECIEVED MESSAGE: ${message.content}`);
        console.log(message);
        channel.ack(message);
    }
}