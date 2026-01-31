// /src/config/db.js

const { Sequelize } = require("sequelize"); // Sequelize kütüphanesini projeye dahil eder

// MySQL veritabanına bağlantı ayarlarını yapar
const sequelize = new Sequelize(
    "ecommerce_db", // Kullanılan veritabanı adı
    "root",         // MySQL kullanıcı adı
    "",             // MySQL şifresi (XAMPP'te genelde boş)
    {
        host: "localhost", // Veritabanı sunucusu (local)
        dialect: "mysql",  // Kullanılan veritabanı türü
    }
);

// Sequelize bağlantı nesnesini dışa aktarır
module.exports = sequelize;
