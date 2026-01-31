// /public/js/checkout.js
import { getCheckout, saveCheckout, getCart, clearCart, money } from "./utils.js"; // Checkout ve sepet için ortak fonksiyonları import eder

// Bu dosya üç farklı checkout sayfasında (step1/step2/step3) çalışır
const pagePath = location.pathname;

// =====================
// STEP 1 (Address)
// =====================

// Step1'de seçilen adresi kaydedip Step2'ye geçirir
function initStep1() {
    const btn = document.querySelector("#step1Next");
    if (!btn) return;

    btn.addEventListener("click", () => {
        const selected = document.querySelector('input[name="address"]:checked');
        const addressKey = selected?.value;

        // Seçilen adrese göre ekranda gösterilecek metni belirler
        let addressText = "";
        if (addressKey === "home") {
            addressText = "2118 Thornridge Cir. Syracuse, Connecticut 35624";
        } else if (addressKey === "office") {
            addressText = "2715 Ash Dr. San Jose, South Dakota 83475";
        }

        // Adres bilgisini checkout objesine kaydeder
        const checkout = getCheckout();
        checkout.addressKey = addressKey;
        checkout.addressText = addressText;
        saveCheckout(checkout);

        // Bir sonraki adıma yönlendirir
        window.location.href = "/step2-page";
    });
}

// =====================
// STEP 2 (Shipping)
// =====================

// Step2'de kargo seçimini kaydedip Step3'e geçirir
function initStep2() {
    const back = document.querySelector("#step2Back");
    const next = document.querySelector("#step2Next");
    if (!next) return;

    // Geri tuşu Step1'e döndürür
    back?.addEventListener("click", () => {
        window.location.href = "/step1-page";
    });

    // İleri tuşu kargo seçimini kaydedip Step3'e götürür
    next.addEventListener("click", () => {
        const selected = document.querySelector('input[name="ship"]:checked');
        const method = selected?.value || "free";

        // Seçilen kargo yöntemine göre özet metni oluşturur
        let shipText = "";
        if (method === "free") shipText = "Free - Regular shipment";
        if (method === "fast") shipText = "$8.50 - Fast delivery";
        if (method === "schedule") {
            const d = document.querySelector("#shipDate")?.value;
            shipText = d ? `Schedule - ${d}` : "Schedule";
        }

        // Kargo bilgisini checkout objesine kaydeder
        const checkout = getCheckout();
        checkout.shipMethod = method;
        checkout.shipText = shipText;
        saveCheckout(checkout);

        // Bir sonraki adıma yönlendirir
        window.location.href = "/step3-page";
    });
}

// =====================
// STEP 3 (Payment Summary + Pay)
// =====================

// Sepetteki ürünü özet için backend'den id ile çeker
async function fetchProductById(id) {
    try {
        const res = await fetch(`/products/${id}`);
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

// Summary alanında tek bir ürün satırının HTML'ini üretir
function renderSummaryRow(p, qty, lineTotal) {
    const title = escapeHtml(p.description || p.title || "Product");
    const img = String(p.imageUrl || p.image || "").trim();

    // Ürün resmi yoksa placeholder gösterir
    const imgHtml = img
        ? `<img src="${img}" alt="" class="sum-img" onerror="this.style.display='none'">`
        : `<div class="sum-img placeholder"></div>`;

    return `
    <div class="sum-row">
      <div class="sum-left">
        ${imgHtml}
        <div class="sum-info">
          <div class="sum-title">${title}</div>
          <div class="sum-qty">x ${qty}</div>
        </div>
      </div>
      <div class="sum-price">${money(lineTotal)}</div>
    </div>
  `;
}

// Step3'te adres+kargo özetini ve sepet özetini gösterip ödeme işlemini tamamlar
async function initStep3() {
    const back = document.querySelector("#step3Back");
    const pay = document.querySelector("#step3Pay");
    if (!pay) return;

    // Geri tuşu Step2'ye döndürür
    back?.addEventListener("click", () => {
        window.location.href = "/step2-page";
    });

    // ---- Summary ----
    const checkout = getCheckout(); // Daha önce seçilen address/ship bilgisini okur

    // Adres ve kargo metnini ekranda gösterir
    const addressEl = document.querySelector("#sumAddress");
    const shipEl = document.querySelector("#sumShip");
    if (addressEl) addressEl.textContent = checkout.addressText || "-";
    if (shipEl) shipEl.textContent = checkout.shipText || "-";

    const itemsEl = document.querySelector("#summaryItems");
    const totalEl = document.querySelector("#sumTotal");

    const cart = getCart(); // Sepet içeriğini okur
    let total = 0;

    // Sepetteki ürünleri özet listesine basar
    if (itemsEl) {
        if (!cart.length) {
            itemsEl.innerHTML = `<div class="text-muted small">Cart is empty.</div>`;
        } else {
            injectSummaryCssOnce(); // Step3 özet görünümü için küçük CSS ekler

            const rows = [];

            for (const item of cart) {
                const pid = item.productId ?? item.id; // Eski/yeni sepet formatını destekler
                const p = await fetchProductById(pid);
                if (!p) continue;

                const qty = Number(item.qty || 1);
                const price = Number(p.price || 0);
                const line = price * qty;
                total += line;

                rows.push(renderSummaryRow(p, qty, line));
            }

            itemsEl.innerHTML = rows.join("");
        }
    }

    // Hesaplanan toplamı ekranda gösterir
    if (totalEl) totalEl.textContent = money(total);

    // ---- PAY ----
    // Ödeme butonuna basınca sepeti temizleyip ana sayfaya döner
    pay.addEventListener("click", () => {
        clearCart();
        localStorage.removeItem("checkout");
        alert("✅ Payment completed!");
        window.location.href = "/";
    });
}

// =====================
// Utils
// =====================

// HTML'e basmadan önce tehlikeli karakterleri temizler
function escapeHtml(str) {
    return String(str ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// Step3 summary görünümü için gerekli küçük CSS'i bir kere ekler
function injectSummaryCssOnce() {
    if (document.getElementById("sum-css")) return;

    const style = document.createElement("style");
    style.id = "sum-css";
    style.textContent = `
    .sum-row{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      padding:10px 12px;
      border-radius:14px;
      background:#f6f6f6;
    }
    .sum-left{
      display:flex;
      align-items:center;
      gap:10px;
      min-width:0;
    }
    .sum-img{
      width:42px;
      height:42px;
      object-fit:contain;
      border-radius:12px;
      background:#fff;
      flex:0 0 auto;
    }
    .sum-img.placeholder{
      background:#e9ecef;
    }
    .sum-info{
      min-width:0;
    }
    .sum-title{
      font-size:14px;
      font-weight:600;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
      max-width:260px;
    }
    .sum-qty{
      font-size:12px;
      color:#6c757d;
    }
    .sum-price{
      font-size:14px;
      font-weight:600;
      white-space:nowrap;
    }
  `;
    document.head.appendChild(style);
}

// =====================
// ROUTER
// =====================

// Bulunduğum sayfaya göre sadece ilgili step fonksiyonunu çalıştırırım
if (pagePath === "/step1-page") initStep1();
if (pagePath === "/step2-page") initStep2();
if (pagePath === "/step3-page") initStep3();

console.log("checkout.js ACTIVE ON:", pagePath); // Hangi step'te çalıştığını görmek için log atar
