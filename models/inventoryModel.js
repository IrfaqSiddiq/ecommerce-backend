// models/product.js

const db = require('../database/db');

const InventoryModel = {
    // Add an item to the inventory
    addInventory: (productId, stockQuantity) => {

    return new Promise((resolve, reject) => {
      // Check if the product exists in the products table
      const checkQuery = `SELECT * FROM products WHERE product_id = ?`;
      db.get(checkQuery, [productId], (err, row) => {
        if (err) {
          return reject(new Error('Error checking product: ' + err.message));
        }
        if (!row) {
          return reject(new Error(`Product with ID ${productId} does not exist`));
        }

        // If product exists, insert into inventory
        const insertQuery = `
          INSERT INTO inventory (product_id, stock_quantity)
          VALUES (?, ?);
        `;
        db.run(insertQuery, [productId, stockQuantity], function (err) {
          if (err) {
            reject(new Error('Error adding to inventory: ' + err.message));
          } else {
            resolve({
              inventoryId: this.lastID,
              productId,
              stockQuantity,
            });
          }
        });
      });
    });
  },
  
};

module.exports = InventoryModel;
