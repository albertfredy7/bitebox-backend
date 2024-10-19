const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem, searchMenuItems } = require('../controllers/menuController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to get all menu items (accessible by everyone)
router.get('/', verifyToken, getMenuItems);

// Route to add a new menu item (accessible only by canteen)
router.post('/', verifyToken, checkRole(['canteen']), upload.single('image'), addMenuItem); // Use multer here

// Route to update a menu item (accessible only by canteen)
router.put('/:id', verifyToken, checkRole(['canteen']), updateMenuItem);

// Route to delete a menu item (accessible only by canteen)
router.delete('/:id', verifyToken, checkRole(['canteen']), deleteMenuItem);

// Route for searching menu items by name
router.get('/search/:query', verifyToken, searchMenuItems);

module.exports = router;
