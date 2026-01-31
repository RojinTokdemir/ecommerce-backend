// /src/models/user.js

const { DataTypes } = require("sequelize"); // Sequelize veri tiplerini kullanmak için
const sequelize = require("../config/db"); // Veritabanı bağlantısını içe aktarır

// User tablosunun modelini tanımlar
const User = sequelize.define("User", {
  // Kullanıcı adı (benzersiz olmalı)
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  // Hashlenmiş şifre bilgisi
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Kullanıcı rolü (user / admin)
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "user",
  },
});

// User modelini dışa aktarır
module.exports = User;
