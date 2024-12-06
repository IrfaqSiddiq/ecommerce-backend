const InventoryModel = require('../models/inventoryModel'); // Assuming ProductModel has an 'addProduct' method

const inventoryController={
    addInventory: async (req, res) => {
        const { product_id, stock_quantity } = req.body;
    
        // Validation for product_id
        if (!product_id || isNaN(product_id) || product_id <= 0) {
            return res.status(400).json({ error: 'Invalid product_id. Must be a positive number' });
        }
    
        // Validation for stock_quantity
        if (!stock_quantity || isNaN(stock_quantity) || stock_quantity <= 0) {
            return res.status(400).json({ error: 'Invalid stock_quantity. Must be a positive number' });
        }
    
        try {
            // Assuming the model method is correct
            const newInventory = { product_id, stock_quantity };
            console.log(newInventory);
    
            // Ensure this line resolves properly with await and returns result
            const result = await InventoryModel.addInventory(product_id, stock_quantity);
    
            // Send response only once
            return res.status(201).json({
                message: 'Inventory updated successfully',
                inventory: result
            });
        } catch (error) {
            // Handle any errors that occur
            if (!res.headersSent) {
                return res.status(400).json({ error: error.message });
            }
        }
    },
    deleteInventory : async (req, res) => {
        
    },
};

module.exports = inventoryController;
