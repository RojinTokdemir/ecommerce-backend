// src/app.js
console.log("app.js LOADED ✅");

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const Product = require("./models/product");

const auth = require("./middlewares/auth");
const requireAdmin = require("./middlewares/requireAdmin");
const attachUser = require("./middlewares/attachUser");

const authRoutes = require("./routes/authRoutes");

const app = express();

// ======================
// MIDDLEWARES
// ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ STATIC: public klasörü (CSS/JS/images) — en kritik satır
const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath));
console.log("✅ STATIC OK:", publicPath);

// ✅ Hızlı test route (silmek istersen sonra sil)
// Tarayıcıdan: http://localhost:3000/__health
app.get("/__health", (req, res) => {
    res.json({
        ok: true,
        publicPath,
    });
});

// ======================
// VIEW ENGINE (EJS)
// ======================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ Her sayfada kullanıcı bilgisi locals'a gelsin
app.use(attachUser);

// ======================
// EJS PAGES
// ======================
app.get("/", (req, res) => res.render("pages/home"));
app.get("/login", (req, res) => res.render("pages/login"));
app.get("/products-page", (req, res) => res.render("pages/products"));
app.get("/details-page", (req, res) => res.render("pages/details"));
app.get("/cart-page", (req, res) => res.render("pages/cart"));
app.get("/step1-page", (req, res) => res.render("pages/step1"));
app.get("/step2-page", (req, res) => res.render("pages/step2"));
app.get("/step3-page", (req, res) => res.render("pages/step3"));
app.get("/favorites", (req, res) => res.render("pages/favorites"));

// ✅ Admin sayfası (sadece admin)
app.get("/admin-page", requireAdmin, (req, res) => res.render("pages/admin"));

// ======================
// AUTH API
// ======================
app.use("/api/auth", authRoutes);

// ======================
// PRODUCTS API
// ======================
app.get("/products", async (req, res) => {
    try {
        const products = await Product.findAll({ order: [["id", "DESC"]] });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/products/:id", async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/products", auth, requireAdmin, async (req, res) => {
    try {
        const { title, price, description, imageUrl, stock } = req.body;

        if (!title || price == null) {
            return res.status(400).json({ error: "title ve price zorunlu" });
        }

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
});

app.put("/products/:id", auth, requireAdmin, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });

        await product.update(req.body);
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete("/products/:id", auth, requireAdmin, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });

        await product.destroy();
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = app;
