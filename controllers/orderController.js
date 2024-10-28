const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// Place a new order
exports.placeOrder = async (req, res) => {
  const { items } = req.body;
  const studentId = req.user.userId; // Assuming userId is extracted from the JWT

  try {
    // Fetch all menu items by their unique IDs from the request payload
    const menuItems = await MenuItem.find({ _id: { $in: items.map(item => item.menuItemId) } });

    // Verify if all requested items were found in the menu
    if (menuItems.length !== items.length) {
      return res.status(400).json({ msg: 'Some menu items were not found' });
    }

    // Calculate total price and prepare order items with all details
    let totalPrice = 0;
    const orderItems = items.map(item => {
      const menuItem = menuItems.find(menuItem => menuItem._id.toString() === item.menuItemId);
      const itemTotalPrice = menuItem.price * item.quantity;
      totalPrice += itemTotalPrice;

      return {
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        imageUrl: menuItem.imageUrl, // Include all relevant details
        quantity: item.quantity,
        itemTotalPrice,
      };
    });

    // Create and save the new order with detailed items
    const newOrder = new Order({
      studentId,
      items: orderItems, // Include the detailed order items
      totalPrice,
      status: 'pending',
      orderTime: new Date(),
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

