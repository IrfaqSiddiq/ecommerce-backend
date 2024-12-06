const express = require('express');
const InventoryController = require('../controllers/inventoryController');

const router = express.Router();

router.post('/add', InventoryController.addInventory);
router.delete('/add', InventoryController.deleteInventory);


module.exports = router;
