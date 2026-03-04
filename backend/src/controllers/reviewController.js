const db = require("../config/db");

/* =========================================
   CUSTOMER - ADD REVIEW
========================================= */
exports.addReview = (req, res) => {
    const { product_id, rating, comment } = req.body;
    const user_id = req.user.id;

    if (!product_id || !rating || !comment) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({
            message: "Rating must be between 1 and 5"
        });
    }

    // ✅ CHECK IF USER BOUGHT PRODUCT & ORDER COMPLETED
    const checkSql = `
        SELECT oi.id
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        WHERE o.user_id = ?
        AND oi.product_id = ?
        AND o.status = 'Completed'
    `;

    db.query(checkSql, [user_id, product_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Server error" });
        }

        if (results.length === 0) {
            return res.status(403).json({
                message: "You can only review completed purchases"
            });
        }

        // ✅ CHECK IF ALREADY REVIEWED
        const duplicateSql = `
            SELECT * FROM reviews
            WHERE user_id = ? AND product_id = ?
        `;

        db.query(duplicateSql, [user_id, product_id], (err, dup) => {
            if (dup.length > 0) {
                return res.status(400).json({
                    message: "You already reviewed this product"
                });
            }

            const insertSql = `
                INSERT INTO reviews (user_id, product_id, rating, comment)
                VALUES (?, ?, ?, ?)
            `;

            db.query(insertSql, [user_id, product_id, rating, comment], (err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Error adding review"
                    });
                }

                res.status(201).json({
                    message: "Review added successfully"
                });
            });
        });
    });
};


/* =========================================
   ADMIN - GET ALL REVIEWS
========================================= */
exports.getAllReviews = (req, res) => {
    const sql = `
        SELECT 
            reviews.id,
            reviews.rating,
            reviews.comment,
            reviews.created_at,
            users.full_name,
            products.name AS product_name
        FROM reviews
        JOIN users ON reviews.user_id = users.id
        JOIN products ON reviews.product_id = products.id
        ORDER BY reviews.created_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Fetch Reviews Error:", err);
            return res.status(500).json({
                message: "Error fetching reviews"
            });
        }

        res.json(results);
    });
};


/* =========================================
   ADMIN - DELETE REVIEW
========================================= */
exports.deleteReview = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM reviews WHERE id = ?", [id], (err) => {
        if (err) {
            console.error("Delete Review Error:", err);
            return res.status(500).json({
                message: "Error deleting review"
            });
        }

        res.json({
            message: "Review deleted successfully"
        });
    });
};


/* =========================================
   PUBLIC - GET REVIEWS PER PRODUCT
========================================= */
exports.getProductReviews = (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT 
            reviews.rating,
            reviews.comment,
            reviews.created_at,
            users.full_name
        FROM reviews
        JOIN users ON reviews.user_id = users.id
        WHERE reviews.product_id = ?
        ORDER BY reviews.created_at DESC
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Product Reviews Error:", err);
            return res.status(500).json({
                message: "Error fetching reviews"
            });
        }

        res.json(results);
    });
};


/* =========================================
   PUBLIC - GET ALL REVIEWS (FOR REVIEWS PAGE)
========================================= */
exports.getAllPublicReviews = (req, res) => {

    const { product_id, sort } = req.query;

    let orderBy = "reviews.created_at DESC";

    if (sort === "highest") {
        orderBy = "reviews.rating DESC";
    }

    if (sort === "lowest") {
        orderBy = "reviews.rating ASC";
    }

    let sql = `
        SELECT 
            reviews.id,
            reviews.rating,
            reviews.comment,
            reviews.created_at,
            users.full_name,
            products.id AS product_id,
            products.name AS product_name
        FROM reviews
        JOIN users ON reviews.user_id = users.id
        JOIN products ON reviews.product_id = products.id
    `;

    if (product_id) {
        sql += " WHERE reviews.product_id = ? ";
    }

    sql += ` ORDER BY ${orderBy}`;

    db.query(sql, product_id ? [product_id] : [], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Error fetching reviews"
            });
        }

        res.json(results);
    });
};