console.log("admin.js çalıştı ✅"); // Dosyanın yüklendiğini kontrol eder

// Sayfadaki temel HTML elemanları
const productList = document.getElementById("productList");
const addBtn = document.getElementById("addBtn");
const refreshBtn = document.getElementById("refreshBtn");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");

// =====================
// AUTH helpers
// =====================

// Kullanıcının token bilgisini alır
function getToken() {
    return localStorage.getItem("token");
}

// Kullanıcının rol bilgisini alır (admin / user)
function getRole() {
    return localStorage.getItem("role");
}

// Yetkili istekler için gerekli header'ları oluşturur
function authHeaders() {
    const h = { "Content-Type": "application/json" };
    const token = getToken();
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
}

// Fiyatı ekranda para formatında gösterir
function money(n) {
    const num = Number(n ?? 0);
    return `${num.toFixed(2)}₺`;
}

// =====================
// PAGE GUARD
// =====================

// Admin olmayan kullanıcıların admin sayfasına girmesini engeller
const role = getRole();
if (role && role !== "admin") {
    alert("Bu sayfa sadece admin için");
    window.location.href = "/";
}

// =====================
// EVENTS
// =====================

// Ürün listesini yeniler
refreshBtn?.addEventListener("click", loadProducts);

// Arama alanına göre ürün listesini filtreler
searchInput?.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();
    filterList(q);
});

// Yeni ürün ekler
addBtn?.addEventListener("click", async () => {
    const titleEl = document.getElementById("title");
    const priceEl = document.getElementById("price");
    const imageUrlEl = document.getElementById("imageUrl");
    const descriptionEl = document.getElementById("description");
    const stockEl = document.getElementById("stock");

    const title = titleEl?.value?.trim();
    const price = priceEl?.value;
    const imageUrl = imageUrlEl?.value?.trim();
    const description = descriptionEl?.value?.trim();
    const stock = stockEl?.value;

    if (!title) return alert("Title boş olamaz");
    if (price === "" || price == null) return alert("Price boş olamaz");

    try {
        const res = await fetch("/products", {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify({
                title,
                price: Number(price),
                imageUrl: imageUrl || "",
                description: description || "",
                stock: stock === "" || stock == null ? 0 : Number(stock),
            }),
        });

        if (!res.ok) {
            alert("Ürün eklenemedi");
            return;
        }

        titleEl.value = "";
        priceEl.value = "";
        imageUrlEl.value = "";
        descriptionEl.value = "";
        stockEl.value = "";

        loadProducts();
    } catch {
        alert("Sunucuya bağlanılamadı");
    }
});

// =====================
// LOAD + RENDER
// =====================

// Ürünleri geçici olarak bellekte tutar
let cachedProducts = [];

// Ürün listesini backend'den alır
async function loadProducts() {
    try {
        const res = await fetch("/products");
        const products = await res.json();
        cachedProducts = Array.isArray(products) ? products : [];
        renderProducts(cachedProducts);
    } catch {
        alert("Ürünler yüklenemedi");
    }
}

// Ürünleri liste olarak ekrana basar
function renderProducts(products) {
    if (!productList) return;

    productList.innerHTML = "";
    emptyState?.classList.add("d-none");

    if (!products.length) {
        emptyState?.classList.remove("d-none");
        return;
    }

    products.forEach((p) => {
        const li = document.createElement("li");
        li.className = "list-group-item";

        li.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <strong>${escapeHtml(p.title)}</strong>
            <div class="small text-muted">
              ${money(p.price)} • stok: ${Number(p.stock ?? 0)}
            </div>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-primary btn-sm" data-action="edit">Edit</button>
            <button class="btn btn-outline-danger btn-sm" data-action="delete">Delete</button>
          </div>
        </div>
      `;

        li.querySelector('[data-action="edit"]')?.addEventListener("click", () => onEdit(p));
        li.querySelector('[data-action="delete"]')?.addEventListener("click", () => onDelete(p));

        productList.appendChild(li);
    });
}

// Arama kelimesine göre ürünleri filtreler
function filterList(q) {
    if (!q) return renderProducts(cachedProducts);

    const filtered = cachedProducts.filter((p) =>
        String(p.title ?? "").toLowerCase().includes(q)
    );

    renderProducts(filtered);
}

// =====================
// EDIT / DELETE
// =====================

// Ürünün fiyat ve stok bilgisini günceller
async function onEdit(p) {
    const price = Number(prompt("Yeni fiyat:", p.price));
    const stock = Number(prompt("Yeni stok:", p.stock));

    if (!Number.isFinite(price) || !Number.isFinite(stock)) return;

    await fetch(`/products/${p.id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ price, stock }),
    });

    loadProducts();
}

// Ürünü sistemden siler
async function onDelete(p) {
    if (!confirm(`"${p.title}" silinsin mi?`)) return;

    await fetch(`/products/${p.id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });

    loadProducts();
}

// HTML'e yazdırmadan önce özel karakterleri temizler
function escapeHtml(str) {
    return String(str ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

// Sayfa açıldığında ürünleri yükler
loadProducts();
