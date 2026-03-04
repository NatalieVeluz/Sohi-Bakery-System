const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

/* =====================================
   PUBLIC ROUTES
===================================== */

// GET ALL REVIEWS (FOR REVIEWS PAGE - PUBLIC)
router.get("/public", reviewController.getAllPublicReviews);

// GET REVIEWS PER PRODUCT (PUBLIC)
router.get("/product/:id", reviewController.getProductReviews);


/* =====================================
   CUSTOMER ROUTE
===================================== */

// ADD REVIEW (CUSTOMER MUST BE LOGGED IN)
router.post("/", verifyToken, reviewController.addReview);


/* =====================================
   ADMIN ROUTES
===================================== */

// GET ALL REVIEWS (ADMIN ONLY)
router.get("/", verifyToken, isAdmin, reviewController.getAllReviews);

// DELETE REVIEW (ADMIN ONLY)
router.delete("/:id", verifyToken, isAdmin, reviewController.deleteReview);

module.exports = router;