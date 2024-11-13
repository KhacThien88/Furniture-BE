const express = require("express");
const fs = require("fs");
const productRoutes = require("./routes/productRoutes");
// const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");
const Product = require("./models/productModel");
const User = require("./models/userModel");
const cors = require("cors");
const authRouteRabbitMQ = require("./routes/rabbitMQAuthRoute");

const app = express();
app.use(cors());
app.use(express.json());

connectDB()
  .then(async () => {
    try {
      // Kiểm tra số lượng tài liệu trong collection Product
      const count = await Product.countDocuments({});
      if (count === 0) {
        // Nếu collection trống, thêm dữ liệu mẫu từ file JSON
        const productData = JSON.parse(
          fs.readFileSync("./data/products.json", "utf-8")
        );
        await Product.insertMany(productData);
        console.log("Sample data inserted");
      }

      // insert users sample data
      // Kiểm tra số lượng tài liệu trong collection User
      const countUser = await User.countDocuments({});
      if (countUser === 0) {
        const userData = JSON.parse(
          fs.readFileSync("./data/users.json", "utf-8")
        );
        await User.insertMany(userData);
        console.log("Sample users data inserted");
      }
    } catch (err) {
      console.error("Error inserting sample data:", err);
    }
  })
  .catch((error) => console.error("MongoDB connection error:", error));

// Định tuyến
app.use("/api", productRoutes);
// app.use("/api/auth", authRoutes);
app.use("/api/auth", authRouteRabbitMQ);

module.exports = app;
