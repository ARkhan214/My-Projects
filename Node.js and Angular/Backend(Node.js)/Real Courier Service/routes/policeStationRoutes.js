const express = require('express');
const router = express.Router();
const policeController = require('../controllers/policeStationController');

router.get('/', policeController.getAll);
router.get('/district/:district_id', policeController.getByDistrict);
router.post('/', policeController.createPoliceStation);
router.put('/:id', policeController.updatePoliceStation);
router.delete('/:id', policeController.deletePoliceStation);




module.exports = router;
