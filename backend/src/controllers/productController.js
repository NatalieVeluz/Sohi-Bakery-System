const db = require("../config/db");

// ================= GET ALL PRODUCTS (PUBLIC) =================
exports.getAllProducts = (req, res) => {
    const sql = `
        SELECT p.*, c.name AS category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.created_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching products" });
        }
        res.json(results);
    });
};

// ================= GET SINGLE PRODUCT =================
exports.getProductById = (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT p.*, c.name AS category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching product" });
        }

        if (!results.length) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(results[0]);
    });
};

// ================= ADD PRODUCT (ADMIN ONLY) =================
exports.addProduct = (req, res) => {
    const { name, description, price, image, category_id } = req.body;

    const sql = `
        INSERT INTO products (name, description, price, image, category_id)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, description, price, image, category_id],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error adding product" });
            }

            res.status(201).json({
                message: "Product added successfully",
                productId: result.insertId
            });
        }
    );
};

// ================= UPDATE PRODUCT (ADMIN ONLY) =================
exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, description, price, image, category_id } = req.body;

    const sql = `
        UPDATE products
        SET name=?, description=?, price=?, image=?, category_id=?
        WHERE id=?
    `;

    db.query(
        sql,
        [name, description, price, image, category_id, id],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error updating product" });
            }

            res.json({ message: "Product updated successfully" });
        }
    );
};

// ================= DELETE PRODUCT =================
exports.deleteProduct = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM products WHERE id = ?", [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error deleting product" });
        }

        res.json({ message: "Product deleted successfully" });
    });
};

// GET SINGLE PRODUCT (PUBLIC)
exports.getProductById = (req, res) => {
    const { id } = req.params;

    db.query(
        "SELECT * FROM products WHERE id = ?",
        [id],
        (err, results) => {
            if (err) return res.status(500).json({ message: "Error fetching product" });

            if (!results.length) {
                return res.status(404).json({ message: "Product not found" });
            }

            res.json(results[0]);
        }
    );
};