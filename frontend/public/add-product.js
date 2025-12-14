document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const feedback = document.getElementById("feedback");
  const form = document.getElementById("add-product-form");

  // ================= AUTH GUARD =================
  if (!token) {
    window.location.href = "login.html?next=add-product.html";
    return;
  }

  // ================= ENSURE ARTISAN =================
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

  // ================= SUBMIT HANDLER =================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    feedback.textContent = "";

    // 🔑 IMPORTANT: Use FormData for file upload
    const formData = new FormData(form);

    // Basic client-side validation
    if (
      !formData.get("name") ||
      !formData.get("category") ||
      !formData.get("price") ||
      !formData.get("image")
    ) {
      feedback.textContent = "Please complete all required fields.";
      return;
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          // ❌ DO NOT set Content-Type manually
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        feedback.textContent = data.msg || "Failed to add product.";
        return;
      }

      // ✅ SUCCESS
      window.location.href = "artisan-dashboard.html";

    } catch (err) {
      console.error(err);
      feedback.textContent = "Network error. Please try again.";
    }
  });
});
