const db = require("../config/db");

// CREATE CATEGORY (ADMIN)
exports.createCategory = (req, res) => {
    const { name } = req.body;

    db.query("INSERT INTO categories (name) VALUES (?)", [name], (err) => {
        if (err) {
            return res.status(400).json({ message: "Category already exists" });
        }
        res.json({ message: "Category created successfully" });
    });
};

// GET ALL CATEGORIES
exports.getCategories = (req, res) => {
    db.query("SELECT * FROM categories", (err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching categories" });
        res.json(results);
    });
};

// DELETE CATEGORY
exports.deleteCategory = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM categories WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ message: "Error deleting category" });
        res.json({ message: "Category deleted" });
    });
};