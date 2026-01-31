// /public/js/favorites.js

// Favorites sayfasındaki liste ve boş durum yazısını yakalar
const listEl = document.querySelector("#favoritesList");
const emptyText = document.querySelector("#favEmptyText");

const LS_FAVS = "favorites"; // Favori ürün id'lerini localStorage'da tutacağım key

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

// Bir ürün favorilerde mi diye kontrol eder
function isFav(id) {
    return getFavIds().includes(Number(id));
}

// Favorilerden id'yi kaldırır
function removeFav(id) {
    id = Number(id);
    const ids = getFavIds().filter((x) => x !== id);
    setFavIds(ids);
}

// Favoriler sayfasında ürün kartının HTML'ini üretir
function cardHTML(p) {
    const img = (p.imageUrl || p.image || "").trim();
    const hasImage = img !== "";
    const detailUrl = `/details-page?id=${p.id}`;

    return `
  <div class="col-sm-12 col-md-6 col-lg-4 d-flex justify-content-center">
    <div class="card" style="width: 18rem; border-radius: 18px;">
      <div class="position-relative">

        ${hasImage
            ? `<img src="${img}" class="card-img-top mx-auto d-block mt-4"
                style="width:160px;height:160pxs;object-fit:contain;" alt="${p.title}">`
            : `<div class="mx-auto mt-4 bg-light rounded-3"
                style="width:160px;height:160px;"></div>`
        }

        <!-- Favorites sayfasında kalp = favoriden kaldır -->
        <button
          class="btn btn-light rounded-circle position-absolute top-0 end-0 m-2 fav-remove"
          type="button"
          data-id="${p.id}"
          aria-label="remove favorite"
          title="Remove"
        >♥</button>
      </div>

      <div class="card-body text-center">
        <p class="small text-muted mb-2">${p.category || ""}</p>
        <p class="card-title mb-2 fw-semibold">${p.title}</p>
        <h5 class="card-text fw-bold">$${Number(p.price).toFixed(0)}</h5>
        <a href="${detailUrl}" class="btn btn-dark w-100 mt-2">Buy Now</a>
      </div>
    </div>
  </div>
  `;
}

// localStorage'daki favori id'lerine göre favori ürünleri sayfada listeler
async function loadFavorites() {
    const favIds = getFavIds();

    // Favori yoksa boş durum mesajını gösterir
    if (!favIds.length) {
        if (emptyText) emptyText.classList.remove("d-none");
        if (listEl) listEl.innerHTML = "";
        return;
    }

    if (emptyText) emptyText.classList.add("d-none");

    // Tüm ürünleri API'den çekip favori id'lerine göre filtreler
    const res = await fetch("/products");
    const items = await res.json();

    const favProducts = items.filter((p) => favIds.includes(Number(p.id)));

    // Favori kartlarını ekrana basar
    listEl.innerHTML = favProducts.map(cardHTML).join("");
}

// Kalp butonuna basınca favoriden kaldırıp listeyi yeniden çizer
listEl?.addEventListener("click", (e) => {
    const btn = e.target.closest(".fav-remove");
    if (!btn) return;

    const id = btn.dataset.id;
    removeFav(id);

    loadFavorites(); // Ürün hemen kaybolsun diye listeyi yeniden çiziyorum
});

// Sayfa açılınca favorileri yükler
loadFavorites();
