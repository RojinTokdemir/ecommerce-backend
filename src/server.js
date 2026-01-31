// src/server.js
require("dotenv").config();

const path = require("path");
const sequelize = require("./config/db");
const app = require("./app");

const User = require("./models/user");
require("./models/product");

const bcrypt = require("bcryptjs");

// ✅ NEW: ürün seed fonksiyonu
const seedProducts = require("./seeders/seedProduct");

// ✅ (ÖNEMLİ) Public klasörünü servis et (resimler/css/js her pc'de çalışsın)
app.use(expressStaticPublic());

function expressStaticPublic() {
    const express = require("express");
    return express.static(path.join(__dirname, "..", "public"));
}

async function seedAdmin() {
    const adminUsername = "admin";
    const adminPassword = "1234";

    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const admin = await User.findOne({ where: { username: adminUsername } });

    if (!admin) {
        await User.create({
            username: adminUsername,
            passwordHash,
            role: "admin",
        });
        console.log("✅ Admin created: admin / 1234");
        return;
    }

    admin.passwordHash = passwordHash;
    admin.role = "admin";
    await admin.save();

    console.log("✅ Admin updated: admin / 1234");
}

function startHttpServer() {
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`✅ Server running: http://localhost:${PORT}`);
        console.log(`🖼️ Test image: http://localhost:${PORT}/images/watch1.png`);
    });
}

async function start() {
    try {
        await sequelize.authenticate();
        console.log("✅ DB connected");

        await sequelize.sync();
        console.log("✅ Tables synced");

        // ✅ DB varsa seed’ler çalışsın
        await seedAdmin();
        await seedProducts();

        startHttpServer();
    } catch (err) {
        // ✅ DB yoksa da server açılsın (dummy fallback app.js tarafında çalışacak)
        console.error("⚠️ DB bağlantısı yok / hata:", err?.message || err);
        console.log("➡️ DB olmadan devam: /products dummy fallback dönecek (birazdan app.js'yi ayarlayacağız).");

        startHttpServer();
    }
}

start();
