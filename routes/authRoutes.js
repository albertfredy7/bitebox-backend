const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Register Route
router.post('/register', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  check('role', 'Role must be either student or canteen').isIn(['student', 'canteen'])
], registerUser);

// Login Route
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], loginUser);

module.exports = router;
