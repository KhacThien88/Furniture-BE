const express = require("express");
const { sendToQueue } = require("../services/rabbitMQProducerService");
const { waitForResponse } = require("../services/rabbitMQConsumerService");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const message = JSON.stringify({ Email: email, Password: password });
  console.log(req.body);
  console.log(message);

  try {
    await sendToQueue(message);
    const response = await waitForResponse();
    console.log(response);
    if (response === "Invalid credentials") {
      res.status(401).json({ error: "Error unauthorized!" });
    } else {
      res.status(200).json({ token: response });
    }
  } catch (error) {
    console.error("Error sending message or receiving response:", error);
    res.status(500).json({ error: "Failed to process login" });
  }
});

module.exports = router;
