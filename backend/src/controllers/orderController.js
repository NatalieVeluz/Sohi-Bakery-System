const db = require("../config/db");

/* =========================================
   CREATE ORDER (Customer)
========================================= */
exports.createOrder = (req, res) => {
    const userId = req.user.id;
    const { items, proof } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: "No items provided" });
    }

    let total = 0;
    const productIds = items.map(item => item.product_id);

    const sqlProducts = `
        SELECT id, price 
        FROM products 
        WHERE id IN (?)
    `;

    db.query(sqlProducts, [productIds], (err, products) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching products" });
        }

        if (!products.length) {
            return res.status(400).json({ message: "Invalid products" });
        }

        // Calculate total
        products.forEach(product => {
            const item = items.find(i => i.product_id === product.id);
            total += product.price * item.quantity;
        });

        const sqlOrder = `
            INSERT INTO orders (user_id, total, status, proof_of_payment)
            VALUES (?, ?, 'Pending', ?)
        `;

        db.query(sqlOrder, [userId, total, proof || null], (err, orderResult) => {
            if (err) {
                return res.status(500).json({ message: "Error creating order" });
            }

            const orderId = orderResult.insertId;

            const orderItemsValues = products.map(product => {
                const item = items.find(i => i.product_id === product.id);
                return [
                    orderId,
                    product.id,
                    item.quantity,
                    product.price * item.quantity
                ];
            });

            const sqlOrderItems = `
                INSERT INTO order_items 
                (order_id, product_id, quantity, subtotal)
                VALUES ?
            `;

            db.query(sqlOrderItems, [orderItemsValues], (err) => {
                if (err) {
                    return res.status(500).json({ message: "Error adding order items" });
                }

                res.status(201).json({
                    message: "Order placed successfully",
                    order_id: orderId
                });
            });
        });
    });
};


/* =========================================
   GET MY ORDERS (Customer - WITH PRODUCTS)
========================================= */
exports.getMyOrders = (req, res) => {
    const userId = req.user.id;

    const sql = `
        SELECT 
            o.id AS order_id,
            o.total,
            o.status,
            o.created_at,
            oi.product_id,
            p.name AS product_name
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching orders" });
        }

        res.json(results);
    });
};


/* =========================================
   GET ORDER DETAILS (Admin)
========================================= */
exports.getOrderDetails = (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT 
            oi.product_id,
            oi.quantity,
            oi.subtotal,
            p.name AS product_name
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching order details" });
        }

        res.json(results);
    });
};


/* =========================================
   GET ALL ORDERS (Admin)
========================================= */
exports.getAllOrders = (req, res) => {
    const sql = `
        SELECT 
            o.id,
            o.total,
            o.status,
            o.created_at,
            u.full_name
        FROM orders o
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching orders" });
        }

        res.json(results);
    });
};


/* =========================================
   UPDATE ORDER STATUS (Admin)
========================================= */
exports.updateOrderStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Pending", "Confirmed", "Cancelled", "Completed"];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    const sql = `
        UPDATE orders 
        SET status = ? 
        WHERE id = ?
    `;

    db.query(sql, [status, id], (err) => {
        if (err) {
            return res.status(500).json({ message: "Error updating status" });
        }

        res.json({ message: "Order status updated successfully" });
    });
};