document.addEventListener("DOMContentLoaded", () => {
  const results = document.getElementById("results");
  const searchInput = document.getElementById("q");
  const searchBtn = document.getElementById("search");

  if (!results) return;

  let allProducts = [];

  // ===============================
  // LOAD PRODUCTS
  // ===============================
  async function loadProducts() {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to load products");
      allProducts = await res.json();
      render(allProducts);
    } catch (err) {
      console.error(err);
      results.innerHTML = `<p style="text-align:center;">Unable to load products.</p>`;
    }
  }

  // ===============================
  // RENDER
  // ===============================
  function render(products) {
    results.innerHTML = "";

    if (!products.length) {
      results.innerHTML = `<p style="text-align:center;">No products found.</p>`;
      return;
    }

    products.forEach(p => {
      const imgSrc = p.image || "/assets/icons/placeholder-product.jpg";

      const card = document.createElement("div");
      card.style.cssText = `
        background:#fff;
        border-radius:16px;
        padding:1.2rem;
        box-shadow:0 10px 25px rgba(0,0,0,0.08);
        display:flex;
        flex-direction:column;
        height:100%;
      `;

      card.innerHTML = `
        <img
          src="${imgSrc}"
          alt="${escapeHtml(p.name)}"
          style="
            width:100%;
            height:180px;
            object-fit:cover;
            border-radius:12px;
            margin-bottom:0.9rem;
            background:#eee;
          "
          onerror="this.src='/assets/icons/placeholder-product.jpg'"
        />

        <div style="display:flex; flex-direction:column; flex:1;">
          <h4 style="margin:0 0 0.4rem 0;">${escapeHtml(p.name)}</h4>

          <p style="color:#555;font-size:0.95rem;margin:0 0 0.8rem 0;">
            ${escapeHtml(p.description || "Handcrafted product")}
          </p>

          <div style="
            margin-top:auto;
            display:flex;
            justify-content:space-between;
            align-items:center;
          ">
            <strong>€${Number(p.price).toFixed(2)}</strong>

            <!-- ✅ ORDER BUTTON -->
            <a
              href="order-product.html?productId=${p.id}"
              style="
                padding:0.6rem 1.3rem;
                border-radius:999px;
                background:#556B2F;
                color:#fff;
                text-decoration:none;
                font-size:0.85rem;
                font-weight:500;
                transition:background .2s ease, transform .1s ease, box-shadow .1s ease;
              "
              onmouseover="this.style.background='#465a27'; this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'"
              onmouseout="this.style.background='#556B2F'; this.style.transform='translateY(0)'; this.style.boxShadow='none'"
            >
              Order
            </a>
          </div>
        </div>
      `;

      results.appendChild(card);
    });
  }

  // ===============================
  // SEARCH
  // ===============================
  function applySearch() {
    const q = (searchInput.value || "").trim().toLowerCase();
    const filtered = allProducts.filter(p =>
      (p.name || "").toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q)
    );
    render(filtered);
  }

  searchBtn?.addEventListener("click", applySearch);
  searchInput?.addEventListener("keydown", e => {
    if (e.key === "Enter") applySearch();
  });

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  loadProducts();
});
