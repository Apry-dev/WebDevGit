document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("productId");

  const token = localStorage.getItem("token");

  if (!productId) {
    document.body.innerHTML = "<p>Invalid product.</p>";
    return;
  }

  if (!token) {
    window.location.href = `login.html?next=order-product.html?productId=${productId}`;
    return;
  }

  let product;

  /* ================= LOAD PRODUCT ================= */
  try {
    const res = await fetch(`/api/products/${productId}`);
    if (!res.ok) throw new Error();
    product = await res.json();
  } catch {
    document.body.innerHTML = "<p>Product not found.</p>";
    return;
  }

  document.getElementById("product-info").innerHTML = `
    <p><strong>${product.name}</strong></p>
    <p>${product.description || ""}</p>
    <p><strong>Price:</strong> ${product.price} RON</p>
  `;

  /* ================= SUBMIT ORDER ================= */
  document.getElementById("order-form").addEventListener("submit", async e => {
    e.preventDefault();

    const quantity = Number(document.getElementById("quantity").value);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ productId, quantity })
    });

    if (!res.ok) {
      alert("Failed to place order");
      return;
    }

    window.location.href = "orders.html";
  });
});
