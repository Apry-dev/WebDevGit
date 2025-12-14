document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const artisanId = params.get("id");

  if (!artisanId) {
    document.querySelector("main").innerHTML =
      "<p style='text-align:center'>Invalid artisan profile.</p>";
    return;
  }

  let artisan;

  /* ================= LOAD ARTISAN ================= */
  try {
    const res = await fetch(`/api/artisans/${artisanId}`);
    if (!res.ok) throw new Error();
    artisan = await res.json();
  } catch {
    document.querySelector("main").innerHTML =
      "<p style='text-align:center'>Artisan not found.</p>";
    return;
  }

  /* ================= RENDER PROFILE ================= */
  document.getElementById("title").textContent =
    artisan.name || artisan.title || "Artisan";

  document.getElementById("craft").textContent =
    artisan.craft || "Traditional Craft";

  document.getElementById("location").textContent =
    artisan.location || "Location not provided.";

  document.getElementById("bio").textContent =
    artisan.bio || "No description available.";

  /* ================= LOAD PRODUCTS ================= */
  const productsEl = document.getElementById("products");

  try {
    const res = await fetch(`/api/products?artisanId=${artisan.id}`);
    const products = res.ok ? await res.json() : [];

    if (!products.length) {
      productsEl.innerHTML = `
        <div class="empty">
          <p>No products available yet.</p>
        </div>
      `;
      return;
    }

   productsEl.innerHTML = products.map(p => `
  <div class="product-card">
    <strong>${p.name}</strong>

    <div class="product-price">${p.price} RON</div>

    <div class="product-desc">
      ${p.description || "Handcrafted with care."}
    </div>

    <a
      href="order-product.html?productId=${p.id}"
      style="
        display:inline-block;
        margin-top:0.9rem;
        padding:0.45rem 0.9rem;
        border-radius:999px;
        background:#556B2F;
        color:#fff;
        font-size:0.85rem;
        text-decoration:none;
      "
    >
      Order
    </a>
  </div>
`).join("");


  } catch {
    productsEl.innerHTML =
      "<p style='text-align:center'>Failed to load products.</p>";
  }
});
