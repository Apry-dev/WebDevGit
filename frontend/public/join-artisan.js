document.addEventListener("DOMContentLoaded", async () => {
  // ===================================================
  // AUTH GUARD — BACKEND IS SOURCE OF TRUTH
  // ===================================================
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html?next=join-artisan.html";
    return;
  }

  // 1️⃣ Verify token with backend
  try {
    const authRes = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!authRes.ok) {
      localStorage.removeItem("token");
      localStorage.removeItem("isArtisan");
      window.location.href = "login.html?next=join-artisan.html";
      return;
    }
  } catch (err) {
    window.location.href = "login.html?next=join-artisan.html";
    return;
  }

  // 2️⃣ If user already artisan → redirect away
  try {
    const artisanRes = await fetch("/api/artisans/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (artisanRes.ok) {
      const artisan = await artisanRes.json();
      if (artisan) {
        window.location.href = "artisan-dashboard.html";
        return;
      }
    }
  } catch {}

  // ===================================================
  // CRAFT ICON PREVIEW
  // ===================================================
  const craftEl = document.getElementById("craft");
  const iconPreview = document.getElementById("icon-preview");

  if (craftEl && iconPreview) {
    craftEl.addEventListener("change", () => {
      const option = craftEl.selectedOptions[0];
      const icon = option?.dataset?.icon || "";
      iconPreview.innerHTML = icon
        ? `<img src="${icon}" width="32" height="32" alt="Craft icon">`
        : "";
    });
  }

  // ===================================================
  // FORM SUBMIT
  // ===================================================
  const form = document.getElementById("artisan-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const craft = document.getElementById("craft").value;
    const street = document.getElementById("street").value.trim();
    const number = document.getElementById("number").value.trim();
    const city = document.getElementById("city").value.trim();

    if (!title || !craft || !street || !number || !city) {
      alert("Please fill in all fields.");
      return;
    }

    const address = `${street} ${number}, ${city}, Romania`;

    try {
      const res = await fetch("/api/artisans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, craft, address })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        document.getElementById("join-feedback").textContent =
          "Failed: " + (data.msg || "Unable to register artisan");
        return;
      }

      // ✅ Persist artisan role
      localStorage.setItem("isArtisan", "true");

      // ✅ Redirect to dashboard
      window.location.href = "artisan-dashboard.html";
    } catch (err) {
      document.getElementById("join-feedback").textContent =
        "Network error. Please try again.";
    }
  });
});
