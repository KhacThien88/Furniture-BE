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
    await sendToQueue(message, "login-queue");
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
router.post("/register", async (req, res) => {
  const {
    FullName,
    Email,
    BirthDate,
    PhoneNumber,
    Province,
    City,
    Nation,
    Address,
    Password,
    ConfirmPassword,
  } = req.body;
  const message = JSON.stringify({
    FullName,
    Email,
    BirthDate,
    PhoneNumber,
    Province,
    City,
    Nation,
    Address,
    Password,
    ConfirmPassword,
  });
  console.log(req.body);
  console.log(message);

  try {
    await sendToQueue(message, "signup-queue");
    const response = await waitForResponse();
    console.log(response);
    if (!response.includes("Signup successful")) {
      res.status(401).json({ error: "Error unauthorized!" });
    } else {
      res.status(200).json({ respose: response });
    }
  } catch (error) {
    console.error("Error sending message or receiving response:", error);
    res.status(500).json({ error: "Failed to process login" });
  }
});

module.exports = router;
