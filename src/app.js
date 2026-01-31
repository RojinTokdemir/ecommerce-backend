// /src/app.js
console.log(" app.js LOADED"); // Sunucu dosyasının çalıştığını kontrol eder

const express = require("express"); // Express framework
const path = require("path"); // Dosya yolu işlemleri için
const cookieParser = require("cookie-parser"); // Cookie okumak için

const Product = require("./models/product"); // Product model

// Admin işlemleri için auth + admin kontrolü
const auth = require("./middlewares/auth");
const requireAdmin = require("./middlewares/requireAdmin");

// EJS sayfalarında user/isAdmin bilgisi göstermek için middleware
const attachUser = require("./middlewares/attachUser");

// Auth route'ları
const authRoutes = require("./routes/authRoutes");

const app = express();


console.log("STATIC OK ✅", __dirname);


// JSON ve form body'leri okumak için parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request cookie'lerini okumak için middleware
app.use(cookieParser());

// public klasörünü statik olarak servis eder (CSS/JS/images)
app.use(express.static(path.join(__dirname, "..", "public")));

// EJS template engine ayarları
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Her sayfada kullanıcı bilgisini EJS locals'a ekler
app.use(attachUser);

// ======================
// EJS PAGES (Frontend Routes)
// ======================

// Ana sayfa ve sayfalar (render)
app.get("/", (req, res) => res.render("pages/home"));
app.get("/login", (req, res) => res.render("pages/login"));
app.get("/products-page", (req, res) => res.render("pages/products"));
app.get("/details-page", (req, res) => res.render("pages/details"));
app.get("/cart-page", (req, res) => res.render("pages/cart"));
app.get("/step1-page", (req, res) => res.render("pages/step1"));
app.get("/step2-page", (req, res) => res.render("pages/step2"));
app.get("/step3-page", (req, res) => res.render("pages/step3"));
app.get("/favorites", attachUser, (req, res) => res.render("pages/favorites"));

// Admin panel sayfası (sadece admin)
app.get("/admin-page", requireAdmin, (req, res) => res.render("pages/admin"));

// ======================
// AUTH (JSON endpoints)
// ======================

// /api/auth/login, /api/auth/register, /api/auth/logout endpointlerini bağlar
app.use("/api/auth", authRoutes);

// ======================
// PRODUCTS (API - JSON)
// ======================

// Tüm ürünleri listeler (herkes erişebilir)
app.get("/products", async (req, res) => {
    try {
        const products = await Product.findAll({ order: [["id", "DESC"]] });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ID'ye göre tek ürün getirir (herkes erişebilir)
app.get("/products/:id", async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Yeni ürün ekler (sadece admin)
app.post("/products", auth, requireAdmin, async (req, res) => {
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
});

// Ürünü günceller (sadece admin)
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

// Ürünü siler (sadece admin)
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

module.exports = app; // app'i index.js/server.js içinden çalıştırmak için dışa aktarır
