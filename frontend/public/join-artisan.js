document.addEventListener("DOMContentLoaded", async () => {
  // ===================================================
  // AUTH GUARD — BACKEND IS SOURCE OF TRUTH
  // ===================================================
  const token = localStorage.getItem("token");

  // Hard stop if no token at all
  if (!token) {
    window.location.replace("login.html?next=join-artisan.html");
    return;
  }

  // Validate token with backend
  try {
    const authRes = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!authRes.ok) {
      localStorage.removeItem("token");
      localStorage.removeItem("isArtisan");
      window.location.replace("login.html?next=join-artisan.html");
      return;
    }
  } catch (err) {
    console.error("Auth check failed:", err);
    window.location.replace("login.html?next=join-artisan.html");
    return;
  }

  // ===================================================
  // ARTISAN GUARD — REDIRECT IF ALREADY ARTISAN
  // ===================================================
  try {
    const artisanRes = await fetch("/api/artisans/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (artisanRes.ok) {
      const artisan = await artisanRes.json();
      if (artisan) {
        // Already artisan → dashboard
        window.location.replace("artisan-dashboard.html");
        return;
      }
    }
  } catch (err) {
    // silent fail — allow join flow
  }

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
    const feedback = document.getElementById("join-feedback");

    if (!title || !craft || !street || !number || !city) {
      feedback.textContent = "Please fill in all fields.";
      return;
    }

    const address = `${street} ${number}, ${city}, Romania`;

    try {
      const res = await fetch("/api/artisans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, craft, address })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        feedback.textContent =
          "Failed: " + (data.msg || "Unable to register artisan");
        return;
      }

      // Persist role locally (UX optimization only)
      localStorage.setItem("isArtisan", "true");

      // Redirect to dashboard
      window.location.replace("artisan-dashboard.html");

    } catch (err) {
      console.error("Network error:", err);
      feedback.textContent = "Network error. Please try again.";
    }
  });
});
