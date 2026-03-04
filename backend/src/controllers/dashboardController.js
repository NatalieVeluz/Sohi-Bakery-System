const db = require("../config/db");

exports.getDashboardStats = async (req, res) => {
    try {
        const connection = db.promise();

        // Total Products
        const [products] = await connection.query(
            "SELECT COUNT(*) AS total_products FROM products"
        );

        // Total Orders
        const [orders] = await connection.query(
            "SELECT COUNT(*) AS total_orders FROM orders"
        );

        // Total Customers
        const [customers] = await connection.query(
            "SELECT COUNT(*) AS total_customers FROM users WHERE role='customer'"
        );

        // 🔥 Total Sales (Exclude Cancelled Orders)
        const [sales] = await connection.query(
            "SELECT SUM(total) AS total_sales FROM orders WHERE status != 'Cancelled'"
        );

        res.json({
            total_products: products[0].total_products,
            total_orders: orders[0].total_orders,
            total_customers: customers[0].total_customers,
            total_sales: sales[0].total_sales || 0
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ message: "Error loading dashboard stats" });
    }
};