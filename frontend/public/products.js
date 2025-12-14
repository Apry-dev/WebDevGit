// products.js — clean & aligned with backend

document.addEventListener("DOMContentLoaded", () => {
  const results = document.getElementById("results");
  const searchInput = document.getElementById("q");
  const searchBtn = document.getElementById("search");

  if (!results) return;

  let allProducts = [];

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
          href="orders.html"
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

  function applySearch() {
    const q = searchInput.value.toLowerCase();
    const filtered = allProducts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
    render(filtered);
  }

  searchBtn.addEventListener("click", applySearch);
  searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") applySearch();
  });

  loadProducts();
});
