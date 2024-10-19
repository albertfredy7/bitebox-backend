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

// Add a new menu item with image upload to Firebase
exports.addMenuItem = async (req, res) => {
  const { name, price, available } = req.body;

  try {
    // Check if file is present
    if (!req.file) {
      return res.status(400).json({ msg: 'No image file uploaded' });
    }

    // Get the image file from Multer's memory storage
    const file = req.file;
    const blob = bucket.file(`menu_images/${Date.now()}_${file.originalname}`);

    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    blobStream.on('error', (err) => {
      console.error(err);
      res.status(500).json({ msg: 'Error uploading image' });
    });

    blobStream.on('finish', async () => {
      // Generate a signed URL with a limited expiration time
      const [url, token] = await blob.getSignedUrl({
        action: 'read',
        expires: '03-09-2035' // Set your desired expiration date
      });

      // Create new menu item with the public URL of the image
      const newItem = new MenuItem({
        name,
        price,
        available,
        imageUrl: url, // Store the signed URL in MongoDB
        imageToken: token // Store the token in MongoDB
      });

      await newItem.save();

      res.status(201).json(newItem);
    });

    blobStream.end(file.buffer); // Send the file's buffer to Firebase
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Error adding menu item' });
  }
};



// Update a menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ msg: 'Menu item not found' });
    }
    res.json(updatedItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Error updating menu item' });
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

