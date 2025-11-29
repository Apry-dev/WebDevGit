// ===== BURGER MENU FUNCTIONALITY =====
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

// guard elements — only attach listeners if they exist
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  // close menu on link click
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });
}

// ===== AUTH-AWARE NAVBAR =====
document.addEventListener('DOMContentLoaded', () => {
  // async check to confirm token is valid on server
  async function updateAuthNav() {
    const token = localStorage.getItem('token');
    let logged = false;

    if (token && token !== 'undefined' && token !== 'null') {
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        logged = res.ok;
        if (!logged) localStorage.removeItem('token');
      } catch {
        localStorage.removeItem('token');
        logged = false;
      }
    }

    document.querySelectorAll('a.login-btn, button.login-btn').forEach(el => {
      if (logged) {
        el.textContent = 'My Account';
        el.href = 'account.html';
        el.onclick = null;
      } else {
        el.textContent = 'Log In';
        el.href = 'login.html';
        el.onclick = null;
      }
    });
  }

  updateAuthNav();

  // wire Join as Artisan CTA after DOM ready
  document.querySelectorAll('.cta-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const token = localStorage.getItem('token');
      if (token && token !== 'undefined' && token !== 'null') {
        window.location.href = 'join-artisan.html';
      } else {
        window.location.href = 'login.html?next=join-artisan.html';
      }
    });
  });

  // existing burger/menu code (guarded earlier)
});