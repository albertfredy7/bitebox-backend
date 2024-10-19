const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  available: { type: Boolean, default: true },
  imageUrl: { type: String } // Add the image URL field
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);
