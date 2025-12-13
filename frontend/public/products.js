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

  loadProducts();
});
