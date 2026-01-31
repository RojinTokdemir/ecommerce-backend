// /src/models/product.js

const { DataTypes } = require("sequelize"); // Sequelize veri tiplerini kullanmak için
const sequelize = require("../config/db"); // Veritabanı bağlantısını içe aktarır

// Product tablosunun modelini tanımlar
const Product = sequelize.define("Product", {
    // Ürün adı
    title: {
        type: DataTypes.STRING,
        allowNull: false, // Boş bırakılamaz
    },

    // Ürün fiyatı
    price: {
        type: DataTypes.DECIMAL(10, 2), // Ondalıklı fiyat tutmak için
        allowNull: false,
    },

    // Ürün görseli URL'i
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true, // Görsel zorunlu değil
    },

    // Ürün açıklaması
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    // Ürün stok miktarı
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // Varsayılan stok 0
    },
});

// Product modelini dışa aktarır
module.exports = Product;



