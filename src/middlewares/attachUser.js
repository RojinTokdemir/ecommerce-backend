// /src/middlewares/attachUser.js

const jwt = require("jsonwebtoken"); // JWT token doğrulamak için kullanılır

// Her request'te kullanıcı bilgisini EJS tarafına ekleyen middleware
module.exports = function attachUser(req, res, next) {
    // EJS sayfalarında kullanılacak varsayılan değerleri sıfırlar
    res.locals.user = null;
    res.locals.isAdmin = false;

    // 1) Önce cookie içinden token almaya çalışır
    let token = req.cookies?.token;

    // 2) Cookie yoksa Authorization header'dan token alır (API istekleri için)
    if (!token) {
        const auth = req.headers.authorization || "";
        if (auth.startsWith("Bearer ")) token = auth.slice(7);
    }

    // Token yoksa kullanıcı bilgisi eklemeden devam eder
    if (!token) return next();

    try {
        // Token'ı doğrulayıp içindeki kullanıcı bilgisini alır
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET || "dev_secret"
        );

        // Kullanıcı bilgisini hem req'e hem de EJS locals'a ekler
        req.user = payload;
        res.locals.user = payload;
        res.locals.isAdmin = payload.role === "admin";
    } catch (e) {
        // Token geçersizse sessizce devam eder
    }

    next(); // Bir sonraki middleware'e geçer
};
