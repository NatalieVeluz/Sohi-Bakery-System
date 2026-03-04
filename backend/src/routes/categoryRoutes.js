const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/", verifyToken, isAdmin, categoryController.createCategory);
router.get("/", categoryController.getCategories);
router.delete("/:id", verifyToken, isAdmin, categoryController.deleteCategory);

module.exports = router;