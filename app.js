const express = require('express');
const fs = require('fs');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/db');
const Product = require('./models/productModel'); // Import model Product
const cors = require('cors');

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
        const data = JSON.parse(
          fs.readFileSync('./data/products.json', 'utf-8')
        );
        await Product.insertMany(data.products);
        console.log('Sample data inserted');
      }
    } catch (err) {
      console.error('Error inserting sample data:', err);
    }
  })
  .catch((error) => console.error('MongoDB connection error:', error));

// Định tuyến
app.use('/api', productRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;
