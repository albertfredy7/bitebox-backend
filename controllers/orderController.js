const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// Place a new order
exports.placeOrder = async (req, res) => {
  const { items } = req.body;
  const studentId = req.user.userId; // Assuming userId is extracted from the JWT

  try {
    // Fetch all menu items in one query
    const menuItems = await MenuItem.find({ name: { $in: items.map(item => item.name) } });

    if (menuItems.length !== items.length) {
      return res.status(400).json({ msg: 'Some menu items were not found' });
    }

    // Calculate total price
    let totalPrice = 0;
    const orderItems = items.map(item => {
      const menuItem = menuItems.find(menu => menu.name === item.name);
      totalPrice += menuItem.price * item.quantity;
      return { name: item.name, quantity: item.quantity };
    });

    // Create the new order
    const newOrder = new Order({
      studentId,
      items: orderItems,
      totalPrice
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// View all orders (for the canteen)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('studentId', 'name email');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// View student's orders
exports.getMyOrders = async (req, res) => {
  const studentId = req.user.userId; // Extracted from JWT

  try {
    const myOrders = await Order.find({ studentId });
    res.json(myOrders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update order status (for the canteen)
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  // Ensure the status is valid
  const validStatuses = ['pending', 'accepted', 'delivered'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ msg: 'Invalid status' });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: 'Order not found' });

    order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { isDeleted: true } },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    res.json({ msg: 'Order marked as deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Error deleting order' });
  }
};

