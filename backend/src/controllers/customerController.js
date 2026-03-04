const db = require("../config/db");

// GET ALL CUSTOMERS WITH ORDER SUMMARY
exports.getCustomers = (req, res) => {
    const sql = `
        SELECT 
            u.id,
            u.full_name,
            u.email,
            COUNT(o.id) AS total_orders,
            IFNULL(SUM(o.total), 0) AS total_spent
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        WHERE u.role = 'customer'
        GROUP BY u.id
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching customers" });
        res.json(results);
    });
};

// GET ORDER HISTORY OF A CUSTOMER
exports.getCustomerOrders = (req, res) => {
    const { id } = req.params;

    db.query(
        "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
        [id],
        (err, results) => {
            if (err) return res.status(500).json({ message: "Error fetching orders" });
            res.json(results);
        }
    );
};