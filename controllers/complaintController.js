const Complaints = require('../models/Complaints');
const Complaint = require('../models/Complaints');

// Fetch all complaints (canteen/admin access)
exports.getComplaints = async (req, res) => {
  try {
    const complaints = await Complaints.find().populate('userId', 'name'); // Populates user name for reference
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
};

// Post a new complaint (student access)
exports.postComplaint = async (req, res) => {
  try {
    const { subject, description } = req.body;
    const complaint = new Complaint({
      subject,
      description,
      userId: req.user._id, // Set the user ID from the authenticated user
      status: 'pending',
    });
    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create complaint' });
  }
};

// Update complaint status (canteen/admin access)
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowedStatuses = ['pending', 'resolved'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update complaint status' });
  }
};
