// models/product.js

const { json } = require("body-parser");
const { getProductImg } = require("../controllers/productController");
const db = require("../database/db");

const ProductModel = {
  addProduct: (product) => {
    const {
      product_name,
      description,
      price,
      productType,
      fileData,
      mimeType,
    } = product;
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO products (product_name, description, price, product_type, img, mimeType)
        VALUES (?, ?, ?, ?, ?, ?);
      `;

      db.run(
        query,
        [
          product_name,
          description,
          price,
          JSON.stringify(productType),
          fileData,
          mimeType,
        ],
        function (err) {
          if (err) {
            reject(new Error("Error inserting product: " + err.message));
          } else {
            resolve({
              id: this.lastID,
              product_name,
              description,
              price,
              productType,
              fileData,
              mimeType,
            });
          }
        }
      );
    });
  },
  deleteProduct: (id) => {
    return new Promise((resolve, reject) => {
      const query = `
        DELETE FROM products WHERE product_id = ?;
      `;
      db.run(query, [id], function (err) {
        if (err) {
          reject(new Error("Error deleting product: " + err.message));
        } else {
          if (this.changes === 0) {
            resolve(null); // No product found with the given ID
          } else {
            resolve({ message: "Product deleted successfully", id });
          }
        }
      });
    });
  },

  updateProduct: (id, fieldsToUpdate) => {
    return new Promise((resolve, reject) => {
      const { product_name, description, price, productType } = fieldsToUpdate;

      // Dynamically build the SET clause for the query
      const updates = [];
      const params = [];

      if (product_name) {
        updates.push("product_name = ?");
        params.push(product_name);
      }
      if (description) {
        updates.push("description = ?");
        params.push(description);
      }
      if (price) {
        updates.push("price = ?");
        params.push(price);
      }
      if (productType) {
        updates.push("product_type = ?");
        params.push(JSON.stringify(productType));
      }

      // Add the ID to the parameters array
      params.push(id);

      // Construct the SQL query
      const query = `
        UPDATE products
        SET ${updates.join(", ")}
        WHERE product_id = ?;
      `;

      db.run(query, params, function (err) {
        if (err) {
          reject(new Error("Error updating product: " + err.message));
        } else {
          if (this.changes === 0) {
            resolve(null); // No rows affected, product not found
          } else {
            resolve({ id, ...fieldsToUpdate }); // Return the updated product
          }
        }
      });
    });
  },
  getProductsList: () => {
    return new Promise((resolve, reject) => {
      const query = `
          SELECT product_id,product_name,description,price,product_type FROM products;`;

      db.all(query, (err, rows) => {
        if (err) {
          return reject(err); // Reject the promise if there's an error
        }

        resolve(rows); // Resolve the promise with the retrieved rows
      });
    });
  },
  getProduct: (id) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM products WHERE product_id = ?`;
      db.get(query, id, (err, rows) => {
        if (err) {
          return reject(err); // Reject the promise if there's an error
        }
        resolve(rows); // Resolve the promise with the retrieved rows
      });
    });
  },
  getProductImg: (id) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT img, mimeType FROM products WHERE product_id = ?`;

      db.get(query, id, (err, row) => {
        if (err) {
          return reject(err);
        } else {
          resolve(row); // Resolve the promise with the retrieved
        }
      });
    });
  },
};

module.exports = ProductModel;
