// =======================================================
// BURGER MENU
// =======================================================
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navLinks.classList.toggle("active");
  });
}

// =======================================================
// NAV CONFIG — SINGLE SOURCE OF TRUTH
// =======================================================
const NAV_ITEMS = {
  base: [
    { label: "Home", href: "index.html" },
    { label: "Crafts", href: "crafts.html" },
    { label: "Map", href: "index.html#map" },
    { label: "Products", href: "products.html" }
  ],
  favourites: { label: "Favourites", href: "favourites.html" },
  joinArtisan: { label: "Join as Artisan", href: "join-artisan.html" },
  dashboard: { label: "My Dashboard", href: "artisan-dashboard.html" }
};

// =======================================================
// AUTH + ROLE RESOLUTION (BACKEND = SOURCE OF TRUTH)
// =======================================================
async function resolveUserState() {
  const token = localStorage.getItem("token");

  if (!token || token === "null" || token === "undefined") {
    return { logged: false };
  }

  try {
    // ---- AUTH CHECK ----
    const authRes = await fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!authRes.ok) {
      localStorage.removeItem("token");
      return { logged: false };
    }

    // ---- ARTISAN CHECK ----
    const artisanRes = await fetch("/api/artisans/me", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (artisanRes.ok) {
      const artisan = await artisanRes.json();
      return {
        logged: true,
        artisan: !!artisan
      };
    }

    return { logged: true, artisan: false };

  } catch (err) {
    console.error("Auth resolution failed:", err);
    localStorage.removeItem("token");
    return { logged: false };
  }
}

// =======================================================
// AUTH BUTTON (Log In / My Account — SAME GREEN STYLE)
// =======================================================
function updateAuthButton(logged) {
  const btn = document.getElementById("auth-btn");
  if (!btn) return;

  btn.classList.add("login-btn"); 

  if (!logged) {
    btn.textContent = "Log In";
    btn.href = "login.html";
  } else {
    btn.textContent = "My Account";
    btn.href = "account.html";
  }
}

// =======================================================
// NAV RENDERER (LEFT ITEMS ONLY)
// =======================================================
function renderNav(items) {
  if (!navLinks) return;

  // Preserve auth slot
  const authSlot = navLinks.querySelector(".auth-slot");

  navLinks.innerHTML = "";

  items.forEach(item => {
    const li = document.createElement("li");
    const a = document.createElement("a");

    a.textContent = item.label;
    a.href = item.href;

    li.appendChild(a);
    navLinks.appendChild(li);
  });

  // Auth button ALWAYS last (far right)
  if (authSlot) {
    navLinks.appendChild(authSlot);
  }
}

// =======================================================
// NAV STATE CONTROLLER
// =======================================================
async function updateNav() {
  if (!navLinks) return;

  const state = await resolveUserState();
  let menu = [...NAV_ITEMS.base];

  // -------- NOT LOGGED IN --------
  if (!state.logged) {
    menu.push(NAV_ITEMS.joinArtisan);
  }

  // -------- LOGGED IN, NOT ARTISAN --------
  else if (!state.artisan) {
    menu.push(NAV_ITEMS.favourites);
    menu.push(NAV_ITEMS.joinArtisan);
  }

  // -------- LOGGED IN, ARTISAN --------
  else {
    menu.push(NAV_ITEMS.favourites);
    menu.push(NAV_ITEMS.dashboard);
  }

  renderNav(menu);
  updateAuthButton(state.logged);
}

// =======================================================
// COOKIE CONSENT BANNER (ONE-TIME, SERVER-DRIVEN)
// =======================================================
document.addEventListener('DOMContentLoaded', async () => {
  const banner = document.getElementById('cookie-consent-banner');
  const btn = document.getElementById('accept-cookies-btn');

  if (!banner || !btn) return;

  try {
    const res = await fetch('/api/cookies/consent', {
      credentials: 'include' 
    });

    const data = await res.json();

    if (!data.consent) {
      banner.style.display = 'flex';
    } else {
      banner.remove();
    }
  } catch (err) {
    console.warn('Cookie consent check failed:', err);
  }

  btn.addEventListener('click', async () => {
    try {
      await fetch('/api/cookies/consent', {
        method: 'POST',
        credentials: 'include' // ✅ REQUIRED
      });

      banner.remove();
    } catch (err) {
      console.warn('Cookie consent save failed:', err);
    }
  });
});

// =======================================================
// INIT
// =======================================================
document.addEventListener("DOMContentLoaded", updateNav);

// =======================================================
// SYNC BETWEEN TABS (login / logout)
// =======================================================
window.addEventListener("storage", e => {
  if (e.key === "token") {
    updateNav();
  }
});
