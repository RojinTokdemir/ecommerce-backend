// /src/routes/authRoutes.js

const express = require("express");
const router = express.Router(); // Auth işlemleri için router oluşturur

const authController = require("../controllers/authController"); // Auth controller'ı içe aktarır

// Kullanıcı kayıt işlemini controller'a bağlar
router.post("/register", authController.register);

// Kullanıcı giriş işlemini controller'a bağlar
router.post("/login", authController.login);

// Kullanıcı çıkış işlemini controller'a bağlar
router.post("/logout", authController.logout);

// Router'ı dışa aktarır
module.exports = router;
