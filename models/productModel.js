const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  price: Number,
  category: String,
  images: [String],
  createdAt: { type: Date, default: Date.now() },
  updatedAt: Date,
});

module.exports = mongoose.model('Product', productSchema);
