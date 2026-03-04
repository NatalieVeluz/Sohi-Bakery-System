const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

/* =====================================
   PUBLIC ROUTES
===================================== */

// GET ALL PRODUCTS
router.get("/", productController.getAllProducts);

// GET SINGLE PRODUCT (IMPORTANT FOR PRODUCT DETAILS PAGE)
// ⚠ MUST be placed AFTER "/" but BEFORE admin routes
router.get("/:id", productController.getProductById);


/* =====================================
   ADMIN ROUTES
===================================== */

// ADD PRODUCT
router.post("/", verifyToken, isAdmin, productController.addProduct);

// UPDATE PRODUCT
router.put("/:id", verifyToken, isAdmin, productController.updateProduct);

// DELETE PRODUCT
router.delete("/:id", verifyToken, isAdmin, productController.deleteProduct);

module.exports = router;