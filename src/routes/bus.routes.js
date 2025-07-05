const express = require('express');
const router = express.Router();
const busController = require('../controllers/bus_controller');
router.post('/create', busController.createBus);
router.get('/all', busController.getAllBuses);
router.get('/:id', busController.getBusById);
router.put('/update/:id', busController.updateBus);
router.delete('/delete/:id', busController.deleteBus);
module.exports = router;