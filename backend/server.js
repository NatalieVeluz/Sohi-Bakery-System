require("dotenv").config();
require("./src/config/db");

const express = require("express");
const cors = require("cors");

const app = express();

/* ==================================
   ROUTE IMPORTS
================================== */
const authRoutes = require("./src/routes/authRoutes");
const productRoutes = require("./src/routes/productRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const customerRoutes = require("./src/routes/customerRoutes");

const { verifyToken, isAdmin } = require("./src/middleware/authMiddleware");

/* ==================================
   GLOBAL MIDDLEWARE
================================== */
app.use(cors());
app.use(express.json());

/* ==================================
   HEALTH CHECK
================================== */
app.get("/", (req, res) => {
    res.send("🚀 SOHI Bakery Backend is running");
});

/* ==================================
   AUTH ROUTES
================================== */
app.use("/api/auth", authRoutes);

/* ==================================
   PRODUCT ROUTES
   GET → Public
   POST/PUT/DELETE → Admin only
================================== */
app.use("/api/products", productRoutes);

/* ==================================
   CATEGORY ROUTES
   POST/DELETE → Admin
   GET → Public
================================== */
app.use("/api/categories", categoryRoutes);

/* ==================================
   ORDER ROUTES
   POST → Customer
   GET /my → Customer
   GET / → Admin
   PUT → Admin
================================== */
app.use("/api/orders", orderRoutes);

/* ==================================
   REVIEW ROUTES
   POST → Customer
   GET → Admin
   DELETE → Admin
================================== */
app.use("/api/reviews", reviewRoutes);

/* ==================================
   DASHBOARD ROUTE (ADMIN ONLY)
================================== */
app.use("/api/dashboard", dashboardRoutes);

/* ==================================
   CUSTOMER RECORDS ROUTE (ADMIN ONLY)
================================== */
app.use("/api/customers", customerRoutes);

/* ==================================
   PROTECTED USER PROFILE
================================== */
app.get("/api/user/profile", verifyToken, (req, res) => {
    res.json({
        message: "User profile accessed successfully",
        user: req.user
    });
});

/* ==================================
   ADMIN TEST ROUTE
================================== */
app.get("/api/admin/test", verifyToken, isAdmin, (req, res) => {
    res.json({
        message: "Admin access granted ✅"
    });
});

/* ==================================
   404 HANDLER
================================== */
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

/* ==================================
   GLOBAL ERROR HANDLER
================================== */
app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err.stack);
    res.status(500).json({
        message: "Internal Server Error"
    });
});

/* ==================================
   START SERVER
================================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});