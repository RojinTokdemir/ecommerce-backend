// /public/js/index.js

// Ürünlerin basılacağı ana container'ı yakalar
const container = document.getElementById("productContainer");

// Backend'den ürünleri çekip sayfada listeler
async function loadProducts() {
  const res = await fetch("/products");
  const products = await res.json();

  // Bootstrap grid yapısını ayarlar
  container.className = "row g-4";

  // Ürün kartlarını HTML olarak oluşturup ekrana basar
  container.innerHTML = products.map(p => productCardHTML(p)).join("");

  // "Buy Now" butonları için tek bir event listener kullanır
  container.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add-to-cart]");
    if (!btn) return;

    const id = Number(btn.getAttribute("data-add-to-cart"));
    addToCart(id);
  });
}

// Tek bir ürün kartının HTML yapısını üretir
function productCardHTML(p) {
  const hasImage = p.imageUrl && p.imageUrl.trim() !== "";

  return `
    <div class="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
      <div class="card border-0 shadow-sm rounded-4" style="width: 22rem;">
        <div class="position-relative pt-4">
          ${hasImage
      ? `<img src="${p.imageUrl}" class="card-img-top mx-auto d-block"
                     style="width:180px;height:180px;object-fit:contain;" alt="${p.title}">`
      : `<div class="mx-auto bg-light rounded-3"
                     style="width:180px;height:180px;"></div>`
    }

          <button class="btn btn-light rounded-circle position-absolute top-0 end-0 m-3"
                  type="button" aria-label="favorite">♡</button>
        </div>

        <div class="card-body text-center px-4 pb-4">
          <p class="small text-muted mb-2">${p.category || ""}</p>
          <h6 class="mb-2">${p.title}</h6>
          <h4 class="fw-bold mb-3">${Number(p.price).toFixed(0)} ₺</h4>

          <button class="btn btn-dark w-100 rounded-3 py-2" data-add-to-cart="${p.id}">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  `;
}

// Ürünü localStorage'daki sepete ekler (varsa adedini artırır)
function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Ürün sepete eklendi 🛒");
}

// Sayfa açıldığında ürünleri yükler
loadProducts();
