// /public/js/details.js

// URL'den ürün id'sini (query string) alır
function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));
    return Number.isFinite(id) ? id : null;
}

// Ürün bilgisini backend'den id ile çeker
async function fetchProductById(id) {
    const res = await fetch(`/products/${id}`);
    if (!res.ok) return null;
    return await res.json();
}

// Fiyatı ekranda formatlı göstermek için kullanılır
function money(n) {
    return `$${Number(n || 0).toFixed(0)}`;
}

// Ürünü localStorage'daki sepete ekler (varsa adedi artırır)
function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            description: product.description,
            price: Number(product.price),
            imageUrl: product.imageUrl,
            qty: 1,
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("✅ Ürün sepete eklendi");
}

// Sayfa açılınca ürün detaylarını getirip DOM'a basar
async function init() {
    const id = getIdFromUrl();
    console.log("URL ID:", id);

    if (!id) {
        alert("URL’de id yok! Örn: /pages/details.html?id=1");
        return;
    }

    const p = await fetchProductById(id);
    console.log("ÜRÜN:", p);

    if (!p) {
        alert("Bu id ile ürün bulunamadı.");
        return;
    }

    // Detay sayfasındaki elemanları yakalar
    const imgEl = document.getElementById("detailImg");
    const titleEl = document.getElementById("detailTitle");
    const priceEl = document.getElementById("detailPrice");
    const addBtn = document.getElementById("addToCartBtn");

    // Başlık alanında description varsa onu gösterir
    if (titleEl) titleEl.textContent = p.description || p.title || "Ürün";

    // Fiyatı ekranda gösterir
    if (priceEl) priceEl.textContent = money(p.price);

    // Ürün resmini basar, resim yoksa varsayılan resme düşer
    if (imgEl) {
        const src = p.imageUrl || "/images/photo1.png";
        imgEl.src = src;

        imgEl.onerror = () => {
            imgEl.onerror = null;
            imgEl.src = "/images/photo1.png";
        };

        imgEl.alt = p.description || p.title || "Product";
    }

    // "Add to cart" butonuna basınca ürünü sepete ekler
    addBtn?.addEventListener("click", () => addToCart(p));
}

// Uygulamayı başlatır
init();
