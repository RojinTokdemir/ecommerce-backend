// /src/controllers/productController.js

const Product = require("../models/product"); // Product modelini içe aktarır

// =====================
// GET /products
// =====================

// Tüm ürünleri listeler (en yeni ürün üstte olacak şekilde)
exports.getAll = async (req, res) => {
    try {
        const products = await Product.findAll({
            order: [["id", "DESC"]],
        });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// =====================
// GET /products/:id
// =====================

// ID'ye göre tek bir ürünü getirir
exports.getById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// =====================
// POST /products (admin)
// =====================

// Yeni ürün oluşturur (sadece admin)
exports.create = async (req, res) => {
    try {
        const { title, price, description, imageUrl, stock } = req.body;

        // Zorunlu alan kontrolü
        if (!title || price == null) {
            return res.status(400).json({ error: "title ve price zorunlu" });
        }

        // Ürünü veritabanına kaydeder
        const created = await Product.create({
            title,
            price,
            description: description || "",
            imageUrl: imageUrl || "",
            stock: stock ?? 0,
        });

        res.status(201).json(created);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// =====================
// PUT /products/:id (admin)
// =====================

// Var olan bir ürünü günceller (sadece admin)
exports.update = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Gönderilen alanlara göre ürünü günceller
        await product.update(req.body);
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// =====================
// DELETE /products/:id (admin)
// =====================

// Ürünü veritabanından siler (sadece admin)
exports.remove = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        await product.destroy();
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
