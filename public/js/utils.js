// /public/js/utils.js

// Para değerlerini ekranda formatlı göstermek için kullanılır
export function money(n) {
    return `${Number(n || 0).toFixed(0)} ₺`;
}

// ---------- CART ----------
const CART_KEY = "cart"; // Sepet bilgisini localStorage'da tutacağım key

// Sepeti localStorage'dan okur
// Sepet formatı: [{ productId: 4, qty: 2 }, ...]
export function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
        return [];
    }
}

// Sepeti localStorage'a kaydeder
export function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart || []));
}

// Ürünü sepete ekler (varsa miktarını artırır)
export function addToCart(productId, qty = 1) {
    const cart = getCart();
    const id = Number(productId);
    const item = cart.find(x => Number(x.productId) === id);

    if (item) item.qty += qty;
    else cart.push({ productId: id, qty });

    saveCart(cart);
    return cart;
}

// Ürünü sepetten tamamen çıkarır
export function removeFromCart(productId) {
    const id = Number(productId);
    const cart = getCart().filter(x => Number(x.productId) !== id);
    saveCart(cart);
    return cart;
}

// Sepeti tamamen temizler
export function clearCart() {
    localStorage.removeItem(CART_KEY);
}

// ---------- CHECKOUT (Step1-2-3) ----------
const CHECKOUT_KEY = "checkout"; // Checkout adımlarındaki bilgileri tutar

// Checkout (adres, kargo vb.) bilgilerini localStorage'dan okur
export function getCheckout() {
    try {
        return JSON.parse(localStorage.getItem(CHECKOUT_KEY)) || {};
    } catch {
        return {};
    }
}

// Checkout bilgilerini localStorage'a kaydeder
export function saveCheckout(data) {
    localStorage.setItem(CHECKOUT_KEY, JSON.stringify(data || {}));
}
