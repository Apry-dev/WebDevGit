<<<<<<< HEAD
// products.js — FINAL, DB-backed, production-ready

document.addEventListener("DOMContentLoaded", () => {
  const results = document.getElementById("results");
  const searchInput = document.getElementById("q");
  const searchBtn = document.getElementById("search");

  if (!results) return;

  let allProducts = [];

  // ================= LOAD PRODUCTS =================
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

  // ================= RENDER =================
  function render(products) {
    results.innerHTML = "";

    if (!products.length) {
      results.innerHTML = `<p style="text-align:center;">No products found.</p>`;
      return;
    }

    products.forEach(p => {
      const card = document.createElement("div");

      card.style.cssText = `
        background:#fff;
        border-radius:16px;
        padding:1.4rem;
        box-shadow:0 10px 25px rgba(0,0,0,0.08);
        display:flex;
        flex-direction:column;
        justify-content:space-between;
        transition:transform .2s ease, box-shadow .2s ease;
      `;

      card.onmouseenter = () => {
        card.style.transform = "translateY(-4px)";
        card.style.boxShadow = "0 16px 35px rgba(0,0,0,0.12)";
      };

      card.onmouseleave = () => {
        card.style.transform = "translateY(0)";
        card.style.boxShadow = "0 10px 25px rgba(0,0,0,0.08)";
      };

      card.innerHTML = `
        <div>
          <h4 style="
            font-family:'Playfair Display',serif;
            font-size:1.3rem;
            margin-bottom:0.4rem;
          ">
            ${p.name}
          </h4>

          <p style="
            color:#555;
            font-size:0.95rem;
            margin-bottom:0.8rem;
          ">
            ${p.description || "Handcrafted product"}
          </p>
        </div>

        <div style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-top:1rem;
        ">
          <strong style="font-size:1.05rem;">€${p.price}</strong>

          <a
            href="order-product.html?productId=${p.id}"
            style="
              padding:0.45rem 1.1rem;
              border-radius:999px;
              background:#556B2F;
              color:#fff;
              text-decoration:none;
              font-size:0.85rem;
              font-weight:500;
            "
          >
            Order
          </a>
        </div>
      `;

      results.appendChild(card);
    });
  }

  // ================= SEARCH =================
  function applySearch() {
    const q = searchInput.value.trim().toLowerCase();

    const filtered = allProducts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );

    render(filtered);
  }

  searchBtn.addEventListener("click", applySearch);
  searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") applySearch();
  });

  // ================= INIT =================
=======
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("q");
  const results = document.getElementById("results");

  let products = [];

  async function loadProducts() {
    results.innerHTML = "<p>Loading products…</p>";

    try {
      const res = await fetch("/api/products");

      if (!res.ok) throw new Error("API error");

      products = await res.json();

      render(products);

    } catch (err) {
      console.error(err);
      results.innerHTML = `
        <p style="color:#b00000;">
          Failed to load products.
        </p>
      `;
    }
  }

  function render(list) {
    if (!list.length) {
      results.innerHTML = `
        <p style="grid-column:1/-1;text-align:center;color:#666;">
          No products found.
        </p>
      `;
      return;
    }

    results.innerHTML = list.map(p => `
      <article style="
        background:#fff;
        border-radius:12px;
        padding:1.2rem;
        box-shadow:0 6px 18px rgba(0,0,0,0.08);
      ">
        <strong style="font-size:1.05rem;">
          ${p.name || "Unnamed product"}
        </strong>

        <p style="color:#666;margin:0.5rem 0;">
          ${p.description || "Handcrafted item"}
        </p>

        <p style="font-size:0.85rem;color:#888;">
          Artisan: ${p.artisan || "Unknown"}
        </p>
      </article>
    `).join("");
  }

  // 🔍 LIVE SEARCH (FROM FIRST LETTER)
  input.addEventListener("input", () => {
    const q = input.value.toLowerCase().trim();

    const filtered = products.filter(p =>
      (p.name || "").toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q) ||
      (p.artisan || "").toLowerCase().includes(q)
    );

    render(filtered);
  });

>>>>>>> origin/main
  loadProducts();
});
