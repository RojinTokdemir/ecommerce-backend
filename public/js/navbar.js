// /public/js/navbar.js

// localStorage'dan giriş yapan kullanıcı bilgisini okur
function getUser() {
    try {
        return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        return null;
    }
}

// Verilen elementi görünür yapar
function show(el) {
    el?.classList.remove("d-none");
}

// Verilen elementi gizler
function hide(el) {
    el?.classList.add("d-none");
}

// Navbar'ı giriş durumuna göre günceller
function refreshNavbar() {
    const user = getUser();

    const adminLink = document.querySelector("#navAdmin");
    const loginIcon = document.querySelector("#navLogin");
    const logoutBtn = document.querySelector("#navLogout");

    // Kullanıcı admin ise admin linkini gösterir
    if (adminLink) {
        if (user && user.role === "admin") show(adminLink);
        else hide(adminLink);
    }

    // Kullanıcı giriş yaptıysa logout, yapmadıysa login ikonunu gösterir
    if (loginIcon && logoutBtn) {
        if (user) {
            hide(loginIcon);
            show(logoutBtn);
        } else {
            show(loginIcon);
            hide(logoutBtn);
        }
    }
}

// Çıkış işlemini yapar ve navbar'ı günceller
async function doLogout() {
    // Backend tarafında cookie varsa temizlenmesi için logout isteği atar
    try {
        await fetch("/api/auth/logout", { method: "POST" });
    } catch { }

    // localStorage'daki auth bilgilerini siler
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Navbar'ı anında günceller
    refreshNavbar();

    // Ana sayfaya yönlendirir
    window.location.href = "/";
}

// Sayfa yüklenince navbar'ı ayarlar ve logout butonunu bağlar
document.addEventListener("DOMContentLoaded", () => {
    refreshNavbar();
    document.querySelector("#navLogout")?.addEventListener("click", doLogout);
});

// login.js içinden tetiklenen event ile navbar'ı yeniden çizer
window.addEventListener("auth-changed", refreshNavbar);

// ✅ Details linkini son bakılan ürüne yönlendir
(function () {
    const a = document.getElementById("navDetails");
    if (!a) return;

    const lastId = localStorage.getItem("lastProductId");
    if (lastId) {
        a.href = `/details-page?id=${lastId}`;
    } else {
        a.href = "/products-page";
    }
})();

