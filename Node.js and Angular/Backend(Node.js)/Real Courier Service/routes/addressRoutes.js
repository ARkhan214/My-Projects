const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');

// Get all addresses with country/division/district/police station names
router.get('/', addressController.getAllAddresses);

// Create a new address
router.post('/', addressController.createAddress);

// Delete address by ID
router.delete('/:id', addressController.deleteAddress);

module.exports = router;
