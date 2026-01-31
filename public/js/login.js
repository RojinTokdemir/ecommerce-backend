// /public/js/login.js
console.log("login.js çalıştı ✅"); // Dosyanın yüklendiğini kontrol eder

const API_BASE = "/api/auth"; // Auth endpointlerinin base path'i
const LS_TOKEN = "token"; // Token'ı localStorage'da tutacağım key
const LS_USER = "user"; // Kullanıcı bilgisini localStorage'da tutacağım key

// Kısa yol: id ile element seçmek için helper
const $ = (id) => document.getElementById(id);

// Token ve user bilgisini localStorage'a kaydeder
function setAuth(token, user) {
    localStorage.setItem(LS_TOKEN, token);
    localStorage.setItem(LS_USER, JSON.stringify(user));
}

// Token ve user bilgisini localStorage'dan siler
function clearAuth() {
    localStorage.removeItem(LS_TOKEN);
    localStorage.removeItem(LS_USER);
}

// Login sonrası yönlendirilecek sayfayı query string'den alır
function getNextUrl() {
    const params = new URLSearchParams(location.search);
    return params.get("next") || "/";
}

// localStorage'dan user bilgisini okur
function getUser() {
    try {
        return JSON.parse(localStorage.getItem(LS_USER) || "null");
    } catch {
        return null;
    }
}

// Sayfadaki "whoami" alanını giriş durumuna göre günceller
function updateWhoAmI() {
    const user = getUser();
    const who = $("whoami");
    if (!who) return;

    if (!user) who.textContent = "Not logged in";
    else who.textContent = `Logged in as: ${user.username} (${user.role})`;
}

// =====================
// LOGIN
// =====================

// Login butonuna basınca giriş isteği atar ve token'ı kaydeder
$("loginBtn")?.addEventListener("click", async () => {
    const username = $("loginUsername")?.value?.trim();
    const password = $("loginPassword")?.value?.trim();
    const err = $("loginError");
    if (err) err.textContent = "";

    if (!username || !password) {
        if (err) err.textContent = "Boş alan bırakma";
        return;
    }

    const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    let data = {};
    try { data = await res.json(); } catch { data = {}; }

    if (!res.ok) {
        if (err) err.textContent = data.message || "Login failed";
        return;
    }

    // Backend'den token ve user gelince localStorage'a kaydeder
    if (!data.token || !data.user) {
        if (err) err.textContent = "Sunucudan beklenen veri gelmedi";
        return;
    }

    setAuth(data.token, data.user);

    // Navbar gibi diğer dosyaların güncellenmesi için event yayınlar
    window.dispatchEvent(new Event("auth-changed"));

    // Kullanıcıyı hedef sayfaya yönlendirir
    location.href = getNextUrl();
});

// Enter'a basınca login butonunu tetikler
["loginUsername", "loginPassword"].forEach((id) => {
    $(id)?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") $("loginBtn")?.click();
    });
});

// =====================
// REGISTER
// =====================

// Register butonuna basınca kayıt isteği atar
$("registerBtn")?.addEventListener("click", async () => {
    const username = $("regUsername")?.value?.trim();
    const password = $("regPassword")?.value?.trim();
    const err = $("regError");
    if (err) err.textContent = "";

    if (!username || !password) {
        if (err) err.textContent = "Boş alan bırakma";
        return;
    }

    const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    let data = {};
    try { data = await res.json(); } catch { data = {}; }

    if (!res.ok) {
        if (err) err.textContent = data.message || "Register failed";
        return;
    }

    // Kayıt sonrası token gelirse otomatik giriş yapar
    if (data.token && data.user) {
        setAuth(data.token, data.user);
        window.dispatchEvent(new Event("auth-changed"));
        updateWhoAmI();
        location.href = getNextUrl();
        return;
    }

    // Otomatik giriş yoksa login sekmesine geçirir
    $("tab-login")?.click();
    $("loginUsername").value = username;
    $("loginPassword").value = "";
    alert("✅ Kayıt başarılı! Şimdi giriş yapabilirsin.");
});

// =====================
// LOGOUT
// =====================

// Logout butonuna basınca çıkış yapar ve localStorage'ı temizler
$("logoutBtn")?.addEventListener("click", async () => {
    try { await fetch(`${API_BASE}/logout`, { method: "POST" }); } catch { }

    clearAuth();
    window.dispatchEvent(new Event("auth-changed"));
    updateWhoAmI();

    alert("Çıkış yapıldı ✅");
    location.href = "/";
});

// Sayfa açılınca giriş durumunu ekrana yansıtır
updateWhoAmI();
