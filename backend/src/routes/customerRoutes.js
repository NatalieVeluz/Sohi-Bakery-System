const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.get("/", verifyToken, isAdmin, customerController.getCustomers);
router.get("/:id/orders", verifyToken, isAdmin, customerController.getCustomerOrders);

module.exports = router;