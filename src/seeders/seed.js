// src/seeders/seed.js
require("dotenv").config();

const sequelize = require("../config/db");

// modelleri yükle (yol önemli!)
require("../models/product");
require("../models/user"); // user modelin varsa, yoksa bu satırı sil

const seedProducts = require("./seedProduct");

(async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ DB connected");

        await sequelize.sync(); // tabloları oluştur
        console.log("✅ Tables synced");

        await seedProducts(); // ürünleri ekle
        console.log("✅ Seed done");

        process.exit(0);
    } catch (err) {
        console.error("❌ Seed error:", err);
        process.exit(1);
    }
})();

