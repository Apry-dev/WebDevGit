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
      card.className = "product-card";

      card.innerHTML = `
        <h4>${p.name}</h4>
        <p>${p.description || "Handcrafted product"}</p>
        <p><strong>€${p.price}</strong></p>
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
