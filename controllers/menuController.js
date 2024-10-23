const MenuItem = require('../models/MenuItem');
const bucket = require('../config/firebaseConfig'); // Import the Firebase bucket


// Get all menu items
exports.getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    if (menuItems.length === 0) {
      return res.json({ msg: 'No food items available in the canteen' });
    }
    res.json(menuItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Error fetching menu items' });
  }
};

// Remove the multer import
// const multer = require('multer');

exports.addMenuItem = async (req, res) => {
  const { name, price, available, imageUrl } = req.body;

  try {
    // Validate if image URL is provided
    if (!imageUrl) {
      return res.status(400).json({ msg: 'Image URL is required' });
    }

    // Create new menu item with the provided image URL
    const newItem = new MenuItem({
      name,
      price,
      available,
      imageUrl
    });

    await newItem.save();

    res.status(201).json(newItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Error adding menu item' });
  }
};

exports.updateMenuItem = async (req, res) => {
  const { name, price, available, imageUrl } = req.body;

  try {
    // Find the existing menu item
    const existingItem = await MenuItem.findById(req.params.id);
    if (!existingItem) {
      return res.status(404).json({ msg: 'Menu item not found' });
    }

    // Prepare the update data
    const updateData = {
      name: name || existingItem.name,
      price: price || existingItem.price,
      available: available === undefined ? existingItem.available : (available === 'true' || available === true),
      imageUrl: imageUrl || existingItem.imageUrl
    };

    // Update the menu item with new image URL and data
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      data: updatedItem,
      message: 'Menu item updated successfully'
    });

  } catch (err) {
    console.error('General error in updateMenuItem:', err);
    res.status(500).json({ msg: 'Server error while updating menu item' });
  }
};

// Delete a menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: 'Menu item not found' });
    }
    res.json({ msg: 'Menu item removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Error deleting menu item' });
  }
};


// Fuzzy search for menu items by name
exports.searchMenuItems = async (req, res) => {
  const { query } = req.params;
  
  try {
    const menuItems = await MenuItem.find({
      name: { $regex: query, $options: 'i' } // Case-insensitive fuzzy search
    });
    res.json(menuItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

