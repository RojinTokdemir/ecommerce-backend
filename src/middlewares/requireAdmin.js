// /src/middlewares/requireAdmin.js

// Sadece admin kullanıcıların erişmesine izin veren middleware
module.exports = function requireAdmin(req, res, next) {
  // attachUser veya auth middleware'den gelen kullanıcı rolünü alır
  const role = req.user?.role || res.locals.user?.role;

  // Kullanıcı admin ise devam eder
  if (role === "admin") return next();

  // Tarayıcıdan gelen sayfa isteği mi kontrol eder
  const accept = req.headers.accept || "";
  const isPageRequest = accept.includes("text/html");

  // Sayfa isteği ise login sayfasına yönlendirir
  if (isPageRequest) {
    return res.redirect("/login");
  }

  // API isteği ise yetki hatası döner
  return res.status(403).json({ message: "Forbidden (admin only)" });
};
