// /public/js/home.js

// Home sayfasında "Shop Now" butonuna basınca ürünler sayfasına yönlendirir
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".shop-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault(); // Varsayılan davranışı engeller
            window.location.href = "/products-page"; // Products sayfasına gider
        });
    });
});
