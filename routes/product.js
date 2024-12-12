const express = require("express");
const multer = require("multer"); // Import multer
const ProductController = require("../controllers/productController"); // Import the controller
const router = express.Router();
// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Define the endpoint to add products
router.post("/add", upload.single("image"), ProductController.addProduct); // Call the controller function with multer middleware
router.delete("/delete/:id", ProductController.deleteProductController); // Accepts id as a path parameter
router.put("/update/:id", ProductController.updateProduct); // Accepts id as a path parameter
router.get("/list", ProductController.getProductsList); // Returns list of products
router.get("/:id", ProductController.getProductDetail); // Returns product details by id
router.get("/img/:id", ProductController.getProductImg); // Returns product image by id

module.exports = router;
