const amqp = require("amqplib");

const RABBITMQ_URL = "amqp://3.107.206.208";

async function sendToQueue(message, QUEUE_NAME) {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: false });

    channel.sendToQueue(QUEUE_NAME, Buffer.from(message));
    console.log(`Message sent to queue "${QUEUE_NAME}":`, message);

    setTimeout(() => {
      channel.close();
      connection.close();
    }, 500);
  } catch (error) {
    console.error("Failed to send message to RabbitMQ:", error);
  }
}

module.exports = { sendToQueue };
