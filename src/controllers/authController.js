// /src/controllers/authController.js

const bcrypt = require("bcryptjs"); // Şifreleri hashlemek ve karşılaştırmak için kullanılır
const jwt = require("jsonwebtoken"); // JWT token üretmek için kullanılır
const User = require("../models/user"); // User modelini içe aktarır

// Kullanıcı bilgileriyle JWT token oluşturur
function signToken(user) {
    return jwt.sign(
        { id: user.id, role: user.role, username: user.username },
        process.env.JWT_SECRET || "dev_secret",
        { expiresIn: "7d" } // Token 7 gün geçerli olur
    );
}

// Token'ı cookie olarak yazar (EJS sayfalarında login durumunu görmek için)
function setTokenCookie(res, token) {
    res.cookie("token", token, {
        httpOnly: true,      // JS tarafından erişilemez
        sameSite: "lax",
        secure: false,      // Local ortamda HTTPS olmadığı için false
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
    });
}

// =====================
// REGISTER
// =====================

// Yeni kullanıcı kaydı oluşturur
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Boş alan kontrolü
        if (!username || !password) {
            return res.status(400).json({ message: "Boş alan bırakma" });
        }

        // Aynı kullanıcı adı var mı kontrol eder
        const exists = await User.findOne({ where: { username } });
        if (exists) {
            return res.status(409).json({ message: "Bu kullanıcı adı zaten var" });
        }

        // Şifreyi hashleyip kullanıcıyı oluşturur
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            passwordHash,
            role: "user",
        });

        // Kullanıcı için JWT token üretir
        const token = signToken(user);

        // Token'ı cookie olarak yazar
        setTokenCookie(res, token);

        // Frontend'e gerekli bilgileri döner
        return res.json({
            token,
            user: { id: user.id, username: user.username, role: user.role },
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// =====================
// LOGIN
// =====================

// Kullanıcı giriş işlemini yapar
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Boş alan kontrolü
        if (!username || !password) {
            return res.status(400).json({ message: "Boş alan bırakma" });
        }

        // Kullanıcıyı veritabanında arar
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: "Hatalı kullanıcı adı/şifre" });
        }

        // Girilen şifre ile hashlenmiş şifreyi karşılaştırır
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            return res.status(401).json({ message: "Hatalı kullanıcı adı/şifre" });
        }

        // Başarılı girişte JWT token üretir
        const token = signToken(user);

        // Token'ı cookie olarak yazar
        setTokenCookie(res, token);

        // Frontend'e token ve user bilgisini döner
        return res.json({
            token,
            user: { id: user.id, username: user.username, role: user.role },
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// =====================
// LOGOUT
// =====================

// Kullanıcıyı çıkış yaptırır ve cookie'deki token'ı temizler
exports.logout = async (req, res) => {
    res.clearCookie("token", { sameSite: "lax", secure: false });
    return res.json({ ok: true });
};
