// /public/js/products.js

// Ürün kartlarının basılacağı container'ı yakalar
const listEl = document.querySelector("#productList");

const LS_FAVS = "favorites"; // Favori ürün id'lerini localStorage'da tutarım
const LS_LAST = "lastProductId"; // ✅ Son bakılan ürün id

// localStorage'dan favori id listesini okur
function getFavIds() {
  try {
    return JSON.parse(localStorage.getItem(LS_FAVS) || "[]");
  } catch {
    return [];
  }
}

// Favori id listesini localStorage'a kaydeder
function setFavIds(ids) {
  localStorage.setItem(LS_FAVS, JSON.stringify(ids));
}

// Ürün favorilerde mi diye kontrol eder
function isFav(id) {
  return getFavIds().includes(Number(id));
}

// Ürünü favorilere ekler / favorilerden çıkarır
function toggleFav(id) {
  id = Number(id);
  const ids = getFavIds();
  const idx = ids.indexOf(id);

  if (idx === -1) ids.push(id);
  else ids.splice(idx, 1);

  setFavIds(ids);
}

// Tek bir ürün kartının HTML'ini üretir (kalp + details link dahil)
function productCardHTML(p) {
  const img = (p.imageUrl || p.image || "").trim();
  const hasImage = img !== "";

  // Detail sayfası EJS olduğu için bu route'a yönlendirir
  const detailUrl = `/details-page?id=${p.id}`;

  const favClass = isFav(p.id) ? "is-fav" : "";

  return `
  <div class="col-sm-12 col-md-6 col-lg-4 d-flex justify-content-center">
    <div class="card" style="width: 18rem; border-radius: 18px;">
      <div class="position-relative">

        ${hasImage
      ? `<img src="${img}" class="card-img-top mx-auto d-block mt-4"
                style="width:160px;height:160px;object-fit:contain;" alt="${p.title}">`
      : `<div class="mx-auto mt-4 bg-light rounded-3"
                style="width:160px;height:160px;"></div>`
    }

        <!-- Kalp butonu hangi ürün olduğunu bilmek için data-id taşır -->
        <button
          class="btn btn-light rounded-circle position-absolute top-0 end-0 m-2 fav-btn ${favClass}"
          type="button"
          data-id="${p.id}"
          aria-label="favorite"
          title="Favorite"
        >
          ${isFav(p.id) ? "♥" : "♡"}
        </button>
      </div>

      <div class="card-body text-center">
        <p class="small text-muted mb-2">${p.category || ""}</p>

        <p class="card-title mb-2 fw-semibold" style="letter-spacing:0.2px;">
          ${p.title}
        </p>

        <h5 class="card-text fw-bold">$${Number(p.price).toFixed(0)}</h5>

        <!-- ✅ Details linkine data-id ekledik -->
        <a href="${detailUrl}" data-id="${p.id}" class="btn btn-dark w-100 mt-2 details-link">Buy Now</a>
      </div>
    </div>
  </div>
  `;
}

// Ürün listesini sayfaya basar
function renderProducts(items) {
  if (!listEl) return;
  listEl.innerHTML = items.map(productCardHTML).join("");
}

// ✅ Tıklamaları tek yerden yönetiyoruz: fav + details
listEl?.addEventListener("click", (e) => {
  // 1) Favori tıklaması
  const favBtn = e.target.closest(".fav-btn");
  if (favBtn) {
    const id = favBtn.dataset.id;
    toggleFav(id);

    // Sadece tıklanan kalbin görünümünü anlık günceller
    const nowFav = isFav(id);
    favBtn.classList.toggle("is-fav", nowFav);
    favBtn.textContent = nowFav ? "♥" : "♡";
    return;
  }

  // 2) Details / Buy Now tıklaması -> lastProductId kaydet
  const detailsLink = e.target.closest(".details-link");
  if (detailsLink) {
    const id = detailsLink.dataset.id;
    if (id) localStorage.setItem(LS_LAST, String(id));
    // href ile normal yönlendirme devam etsin
  }
});

// Ürünleri backend'den çekip listeyi oluşturur
async function loadProducts() {
  try {
    const res = await fetch("/products");
    const items = await res.json();
    renderProducts(items);
  } catch (err) {
    console.error(err);
    if (listEl) listEl.innerHTML = `<p class="text-danger">Ürünler yüklenemedi</p>`;
  }
}

// Sayfa açılınca ürünleri yükler
loadProducts();
