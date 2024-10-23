const express = require('express');
const router = express.Router();
const { placeOrder, getOrders, getMyOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Place a new order (for students)
router.post('/', verifyToken, checkRole(['student']), placeOrder);

// Get all orders (for canteen)
router.get('/', verifyToken, checkRole(['canteen']), getOrders);

// Get student's own orders (for students)
router.get('/my-orders', verifyToken, checkRole(['student']), getMyOrders);

// Update order status (for canteen)
router.put('/:id/status', verifyToken, checkRole(['canteen']), updateOrderStatus);

// Delete an order
router.delete('/:id', deleteOrder);

module.exports = router;
