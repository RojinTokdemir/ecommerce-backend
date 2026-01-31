// src/server.js

require("dotenv").config();

const path = require("path");
const sequelize = require("./config/db");
const app = require("./app");

const User = require("./models/user");
require("./models/product");

const bcrypt = require("bcryptjs");

// ✅ (ÖNEMLİ) Public klasörünü servis et (resimler/css/js her pc'de çalışsın)
// Eğer app.js içinde zaten yapıyorsan, burayı kaldırabilirsin.
// Ama garanti olsun diye buraya da koyabilirsin.
app.use(expressStaticPublic());

function expressStaticPublic() {
    // app.js içinde express importlu olduğu için burada direkt express kullanmıyoruz.
    // Sadece static middleware döndürüyoruz:
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

async function start() {
    try {
        await sequelize.authenticate();
        console.log("✅ DB connected");

        await sequelize.sync();
        console.log("✅ Tables synced");

        await seedAdmin();

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`✅ Server running: http://localhost:${PORT}`);

            // ✅ Hızlı test linkleri (terminalden gör)
            console.log(`🖼️ Test image: http://localhost:${PORT}/images/watch1.png`);
        });
    } catch (err) {
        console.error("❌ Startup error:", err?.message || err);
        process.exit(1);
    }
}

start();
