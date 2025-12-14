// order-product.js — FINAL

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html?next=" + window.location.pathname + window.location.search;
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("productId");

  if (!productId) {
    alert("Missing product ID");
    return;
  }

  const form = document.getElementById("order-form");
  const quantityInput = document.getElementById("quantity");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const quantity = Number(quantityInput.value);
    if (quantity < 1) {
      alert("Invalid quantity");
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          quantity
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.msg || "Failed to place order");
        return;
      }

      // ✅ SUCCESS → redirect
      window.location.href = "orders.html";

    } catch (err) {
      console.error(err);
      alert("Network error while placing order");
    }
  });
});
