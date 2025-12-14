document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const feedback = document.getElementById("feedback");
  const form = document.getElementById("add-product-form");

  if (!token) {
    window.location.href = "login.html?next=add-product.html";
    return;
  }

  // Ensure user is artisan
  try {
    const res = await fetch("/api/artisans/me", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      window.location.href = "join-artisan.html";
      return;
    }
  } catch {
    window.location.href = "login.html";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    feedback.textContent = "";

    const name = document.getElementById("name").value.trim();
    const category = document.getElementById("category").value.trim();
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value.trim();

    if (!name || !category || !price) {
      feedback.textContent = "Please complete all required fields.";
      return;
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, category, price, description })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        feedback.textContent = data.msg || "Failed to add product.";
        return;
      }

      window.location.href = "artisan-dashboard.html";
    } catch {
      feedback.textContent = "Network error. Please try again.";
    }
  });
});
