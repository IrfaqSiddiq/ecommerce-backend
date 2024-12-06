const ProductModel = require("../models/productModel"); // Assuming ProductModel has an 'addProduct' method

const fs = require("fs");
const path = require("path");

const productController = {
  addProduct: async (req, res) => {
    const body = req.body;
    console.log("Request body:", body); // Logs the form fields
    console.log("Request files:", req.file); // Logs the uploaded file

    const { product_name, description, price, productType } = body;
    const { file } = req;

    console.log("********image", file);

    // Read the file and insert it into the database
    const fileData = fs.readFileSync(file.path);

    const mimeType = file.mimetype;
    // Validate product_name length (must be > 0)
    if (!product_name || product_name.trim().length === 0) {
      return res.status(400).json({ error: "Product name must not be empty" });
    }

    // Validate price (must be a numeric value)
    if (!price || isNaN(price) || price <= 0) {
      return res
        .status(400)
        .json({ error: "Invalid product price. Must be a positive number" });
    }

    // Validate productTag (must be an array)
    if (!Array.isArray(productType) || productType.length === 0) {
      return res
        .status(400)
        .json({ error: "Product tag must be a non-empty array" });
    }

    // Validate description (optional check if it's non-empty)
    if (!description || description.trim() === "") {
      return res.status(400).json({ error: "Product description is required" });
    }

    try {
      // Assuming id is generated automatically or passed separately
      const newProduct = {
        product_name,
        description,
        price,
        productType,
        fileData,
        mimeType,
      };

      const result = await ProductModel.addProduct(newProduct); // Assuming ProductModel.addProduct handles DB insertion
      res
        .status(201)
        .json({ message: "Product created successfully", product: result });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  deleteProductController: async (req, res) => {
    const { id } = req.params; // Extract id from path parameter

    try {
      // Call model function to delete the product by id
      const result = await ProductModel.deleteProduct(id);

      if (result) {
        res
          .status(200)
          .json({ message: `Product with ID ${id} deleted successfully` });
      } else {
        res.status(404).json({ message: `Product with ID ${id} not found` });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateProduct: async (req, res) => {
    const { id } = req.params; // Extract id from the path parameter
    const { product_name, description, price, productType } = req.body;

    // Check if at least one field is provided for update
    if (!product_name && !description && !price && !productType) {
      return res
        .status(400)
        .json({ error: "At least one field must be provided for update" });
    }

    try {
      const updatedFields = { product_name, description, price, productType };

      const result = await ProductModel.updateProduct(id, updatedFields);
      if (result) {
        res
          .status(200)
          .json({
            message: `Product with ID ${id} updated successfully`,
            product: result,
          });
      } else {
        res.status(404).json({ message: `Product with ID ${id} not found` });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getProductsList: async (req, res) => {
    try {
      const products = await ProductModel.getProductsList();
      console.log("***********************status ok****************");
      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getProductDetail: async (req, res) => {
    const { id } = req.params;

    try {
      const result = await ProductModel.getProduct(id);
      if (result) {
        res
          .status(200)
          .json({ message: `Successfully Fetched Product`, product: result });
      } else {
        res.status(404).json({ message: `Product with ID ${id} not found` });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getProductImg: async (req, res) => {
    const { id } = req.params;

    try {
      const row = await ProductModel.getProductImg(id);

      if (row.img) {
        res.setHeader("Content-Type", row.mimeType); // Set the correct MIME type
        res.send(row.img);
      } else {
        res.status(500).json({ message: `Image with ID ${id} not found` });
      }
    } catch (error) {
      console.error("Error fetching image:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = productController;
