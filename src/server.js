// /src/index.js (veya server.js)

// .env içindeki PORT vb. ortam değişkenlerini kullanmak için
require("dotenv").config();

const sequelize = require("./config/db"); // Veritabanı bağlantısı
const app = require("./app"); // Express uygulaması

const User = require("./models/user"); // User modeli
require("./models/product"); // Product modelini yükleyerek tabloyu oluşturur

const bcrypt = require("bcryptjs"); // Şifre hashlemek için

// Admin kullanıcıyı otomatik oluşturan / güncelleyen fonksiyon
async function seedAdmin() {
    const adminUsername = "admin";
    const adminPassword = "1234";

    // Admin şifresini güvenli şekilde hashler
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const admin = await User.findOne({ where: { username: adminUsername } });

    // Admin yoksa oluşturur
    if (!admin) {
        await User.create({
            username: adminUsername,
            passwordHash,
            role: "admin",
        });
        console.log("✅ Admin created: admin / 1234");
        return;
    }

    // Admin varsa şifre ve rol bilgisini garantiye alır
    admin.passwordHash = passwordHash;
    admin.role = "admin";
    await admin.save();

    console.log("✅ Admin updated: admin / 1234");
}

// Sunucuyu başlatan ana fonksiyon
async function start() {
    try {
        // Veritabanına bağlanır
        await sequelize.authenticate();
        console.log("✅ DB connected");

        // Modelleri veritabanı ile senkronize eder
        await sequelize.sync();

        // Gerekirse tablo yapısını güncellemek için:
        // await sequelize.sync({ alter: true });

        console.log("✅ Tables synced");

        // Admin kullanıcıyı hazırlar
        await seedAdmin();

        // Sunucuyu ayağa kaldırır
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () =>
            console.log(`✅ Server running: http://localhost:${PORT}`)
        );
    } catch (err) {
        console.error("❌ Startup error:", err?.message || err);
    }
}

// Uygulamayı başlatır
start();


