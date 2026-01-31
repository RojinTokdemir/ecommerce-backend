// /src/routes/productRoutes.js

const express = require("express");
const router = express.Router(); // Ürünlerle ilgili endpointler için router

const productController = require("../controllers/productController"); // Ürün controller'ı
const requireAdmin = require("../middlewares/requireAdmin"); // Admin kontrol middleware'i

// Tüm ürünleri listeler (herkes erişebilir)
router.get("/", productController.getAll);

// ID'ye göre tek bir ürünü getirir (herkes erişebilir)
router.get("/:id", productController.getById);

// Yeni ürün ekler (sadece admin)
router.post("/", requireAdmin, productController.create);

// Ürünü günceller (sadece admin)
router.put("/:id", requireAdmin, productController.update);

// Ürünü siler (sadece admin)
router.delete("/:id", requireAdmin, productController.remove);

// Router'ı dışa aktarır
module.exports = router;
