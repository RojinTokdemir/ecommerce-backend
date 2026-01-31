// /src/middlewares/auth.js

const jwt = require("jsonwebtoken"); // JWT token doğrulamak için kullanılır
const User = require("../models/user"); // User modelini içe aktarır

// Giriş yapmış kullanıcıyı doğrulayan middleware
module.exports = async function auth(req, res, next) {
    try {
        // 1) Önce Authorization header içinden token almaya çalışır
        const header = req.headers.authorization || "";
        let token = header.startsWith("Bearer ") ? header.slice(7) : null;

        // 2) Header yoksa cookie içinden token alır
        if (!token) token = req.cookies?.token;

        // Token yoksa yetkisiz hatası döner
        if (!token) {
            return res.status(401).json({ message: "No token" });
        }

        // Token'ı doğrular ve içindeki kullanıcı bilgisini alır
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET || "dev_secret"
        );

        // Kullanıcıyı veritabanından id ile bulur
        const user = await User.findByPk(payload.id, {
            attributes: ["id", "username", "role"],
        });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Doğrulanan kullanıcıyı req içine ekler
        req.user = user;
        return next(); // Bir sonraki middleware'e geçer
    } catch (err) {
        // Token geçersiz veya süresi dolmuşsa
        return res.status(401).json({ message: "Invalid token" });
    }
};
