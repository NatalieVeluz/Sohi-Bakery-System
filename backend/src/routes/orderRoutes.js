const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

/* ===============================
   CUSTOMER ROUTES
================================ */
router.post("/", verifyToken, orderController.createOrder);
router.get("/my", verifyToken, orderController.getMyOrders);

/* ===============================
   ADMIN ROUTES
================================ */
router.get("/", verifyToken, isAdmin, orderController.getAllOrders);
router.get("/:id", verifyToken, isAdmin, orderController.getOrderDetails);
router.put("/:id", verifyToken, isAdmin, orderController.updateOrderStatus);

module.exports = router;