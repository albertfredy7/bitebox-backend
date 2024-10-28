const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
      name: String,
      price: Number,
      imageUrl: String,
      quantity: Number,
      itemTotalPrice: Number,
    },
  ],
  status: { type: String, enum: ['pending', 'accepted', 'delivered'], default: 'pending' },
  totalPrice: Number,
  orderTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
