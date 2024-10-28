const express = require('express');
const router = express.Router();
const { getComplaints, postComplaint, updateComplaintStatus } = require('../controllers/complaintController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');


// Route to fetch all complaints (accessible by canteen/admin)
router.get('/', verifyToken, checkRole(['canteen', 'admin']), getComplaints);

// Route to post a new complaint (accessible by students)
router.post('/', verifyToken, checkRole(['student']), postComplaint);

// Route to update the status of a complaint (accessible by canteen/admin)
router.put('/:id/status', verifyToken, checkRole(['canteen', 'admin']), updateComplaintStatus);

module.exports = router;
