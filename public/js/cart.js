// /public/js/cart.js
console.log("cart.js çalıştı ✅"); // Dosyanın yüklendiğini kontrol eder

const CART_KEY = "cart"; // Sepeti localStorage'da tutacağım key

// Sepet sayfasındaki HTML elemanlarını yakalıyorum
const cartRoot = document.getElementById("cartList");
const subtotalEl = document.getElementById("sumSubtotal");
const taxEl = document.getElementById("sumTax");
const shippingEl = document.getElementById("sumShip");
const totalEl = document.getElementById("sumTotal");

// Para değerlerini ekranda formatlı göstermek için kullanıyorum
function money(n) {
    return `$${Number(n || 0).toFixed(0)}`;
}

// Sepeti localStorage'dan okur
function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

// Sepeti localStorage'a kaydeder
function setCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Ürün bilgisini backend'den id ile çeker
async function fetchProduct(id) {
    const res = await fetch(`/products/${id}`);
    if (!res.ok) return null;
    return await res.json();
}

// Sepette eksik kalan ürün alanlarını (title/price/image) backend'den tamamlar
async function enrichCart(cart) {
    const enriched = [];
    for (const item of cart) {
        if (item.title && item.price != null && item.imageUrl) {
            enriched.push(item);
            continue;
        }

        const p = await fetchProduct(item.id);
        if (!p) continue;

        enriched.push({
            id: item.id,
            qty: item.qty,
            title: p.title,
            description: p.description,
            price: p.price,
            imageUrl: p.imageUrl,
        });
    }
    return enriched;
}

// Sepet toplamlarını (ara toplam, vergi, kargo, genel toplam) hesaplar
function calc(cart) {
    const subtotal = cart.reduce(
        (sum, i) => sum + Number(i.price || 0) * Number(i.qty || 0),
        0
    );

    const tax = 50; // Tasarımdaki sabit vergi değeri
    const shipping = 29; // Tasarımdaki sabit kargo değeri

    const total = subtotal + tax + shipping;
    return { subtotal, tax, shipping, total };
}

// Sağ taraftaki özet alanını günceller
function updateSummary(cart) {
    const { subtotal, tax, shipping, total } = calc(cart);

    if (subtotalEl) subtotalEl.textContent = money(subtotal);
    if (taxEl) taxEl.textContent = money(tax);
    if (shippingEl) shippingEl.textContent = money(shipping);
    if (totalEl) totalEl.textContent = money(total);
}

// --- actions ---
// Ürün adedini 1 artırır
function inc(id) {
    const cart = getCart();
    const item = cart.find((x) => x.id === id);
    if (!item) return;

    item.qty += 1;
    setCart(cart);
    render();
}

// Ürün adedini 1 azaltır (0 olursa sepetten çıkarır)
function dec(id) {
    const cart = getCart();
    const item = cart.find((x) => x.id === id);
    if (!item) return;

    item.qty -= 1;

    if (item.qty <= 0) {
        setCart(cart.filter((x) => x.id !== id));
    } else {
        setCart(cart);
    }
    render();
}

// Ürünü sepetten tamamen siler
function removeItem(id) {
    setCart(getCart().filter((x) => x.id !== id));
    render();
}

// Sepetteki bir ürün satırının HTML'ini üretir
function rowHTML(item) {
    const name = item.description || item.title || "Product"; // UI'da açıklama varsa onu gösteriyorum
    const img = item.imageUrl || "/images/photo1.png"; // Resim yoksa varsayılan resim kullanıyorum
    const lineTotal = Number(item.price || 0) * Number(item.qty || 0); // Satır toplamını hesaplıyorum

    return `
    <div class="d-flex align-items-center py-4 border-bottom" data-id="${item.id}">
      <img src="${img}" alt=""
        style="width:72px;height:72px;object-fit:contain;border-radius:14px;background:#f5f5f5;"
        class="me-3"
        onerror="this.onerror=null;this.src='/images/photo1.png';"
      >

      <div class="flex-grow-1">
        <div class="fw-semibold">${escapeHtml(name)}</div>
        <div class="text-muted small">#${String(item.id).padStart(6, "0")}</div>
      </div>

      <div class="d-flex align-items-center gap-3">
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-outline-secondary btn-sm" data-action="dec">−</button>
          <input class="form-control text-center" value="${item.qty}" readonly style="width:52px;">
          <button class="btn btn-outline-secondary btn-sm" data-action="inc">+</button>
        </div>

        <div class="fw-semibold" style="min-width:90px;text-align:right;">
          ${money(lineTotal)}
        </div>

        <button class="btn btn-link text-decoration-none text-muted fs-4 lh-1" data-action="remove">×</button>
      </div>
    </div>
  `;
}

// Sepeti ekrana basar ve buton eventlerini bağlar
async function render() {
    if (!cartRoot) {
        console.warn("cartList bulunamadı (HTML'de id='cartList' olmalı).");
        return;
    }

    const base = getCart();

    if (!base.length) {
        cartRoot.innerHTML = `<div class="text-muted py-5 text-center">Sepet boş.</div>`;
        updateSummary([]);
        return;
    }

    const cart = await enrichCart(base);

    // Enriched veriyi kaydedip sonraki render'ı hızlandırıyorum
    setCart(
        cart.map((i) => ({
            id: i.id,
            qty: i.qty,
            title: i.title,
            description: i.description,
            price: i.price,
            imageUrl: i.imageUrl,
        }))
    );

    cartRoot.innerHTML = cart.map(rowHTML).join("");

    // Her satırdaki + / - / sil butonlarına id'ye göre event bağlıyorum
    cartRoot.querySelectorAll("[data-id]").forEach((row) => {
        const id = Number(row.getAttribute("data-id"));

        row.querySelector('[data-action="inc"]')?.addEventListener("click", () => inc(id));
        row.querySelector('[data-action="dec"]')?.addEventListener("click", () => dec(id));
        row.querySelector('[data-action="remove"]')?.addEventListener("click", () => removeItem(id));
    });

    updateSummary(cart);
}

// HTML içine yazdırmadan önce özel karakterleri temizler (XSS için)
function escapeHtml(str) {
    return String(str ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// Sayfa açılınca sepeti hemen ekrana basarım
render();
