const amqp = require("amqplib");

const RABBITMQ_URL = "amqp://3.107.206.208";
const RESPONSE_QUEUE_NAME = "response-queue";

let connection;
let channel;

async function setupRabbitMQ() {
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(RESPONSE_QUEUE_NAME, { durable: false });
    console.log(
      `Connected to RabbitMQ and queue "${RESPONSE_QUEUE_NAME}" is ready`
    );
  } catch (error) {
    console.error("Failed to set up RabbitMQ:", error);
  }
}

async function ensureRabbitMQConnection() {
  if (!connection || !channel) {
    await setupRabbitMQ();
  }
}

async function waitForResponse() {
  await ensureRabbitMQConnection();

  return new Promise((resolve, reject) => {
    try {
      console.log("Waiting for response...");
      channel
        .consume(
          RESPONSE_QUEUE_NAME,
          (msg) => {
            if (msg !== null) {
              const messageContent = msg.content.toString("utf8");
              console.log("Received message:", messageContent);

              channel.ack(msg);
              resolve(messageContent);

              // Hủy đăng ký tiêu thụ sau khi nhận thông điệp
              if (msg.fields && msg.fields.consumerTag) {
                channel.cancel(msg.fields.consumerTag);
              }
            }
          },
          { noAck: false }
        )
        .then(({ consumerTag }) => {
          console.log(
            `Listening for messages on queue "${RESPONSE_QUEUE_NAME}" with consumerTag "${consumerTag}"`
          );
        })
        .catch((error) => {
          console.error("Failed to start consuming:", error);
          reject(error);
        });
    } catch (error) {
      console.error("Failed to wait for response:", error);
      reject(error);
    }
  });
}

// Gọi setupRabbitMQ khi module được khởi tạo
setupRabbitMQ().catch((error) => {
  console.error("Error setting up RabbitMQ:", error);
});

module.exports = { waitForResponse };
