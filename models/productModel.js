const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  price: Number,
  category: String,
  images: [String],
  reviews: [
    {
      user: String,
      rating: Number,
      comment: String,
    },
  ],
});

module.exports = mongoose.model('Product', productSchema);
