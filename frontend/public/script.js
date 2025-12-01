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

// define at top-level so listeners can call it
async function updateAuthNav() {
  const token = localStorage.getItem('token');
  let logged = false;

  if (token && token !== 'null' && token !== 'undefined') {
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

  // show/hide items meant only for authenticated users
  document.querySelectorAll('.auth-only').forEach(el => {
    el.style.display = logged ? '' : 'none';
  });

  // update private links to redirect to login when not logged
  document.querySelectorAll('a.private-link').forEach(a => {
    const target = a.dataset.href || a.getAttribute('href') || '';
    a.href = logged ? target : `login.html?next=${encodeURIComponent(target)}`;
  });

  // login button -> account when logged
  document.querySelectorAll('a.login-btn, button.login-btn').forEach(el => {
    if (logged) { el.textContent = 'My Account'; el.href = 'account.html'; }
    else { el.textContent = 'Log In'; el.href = 'login.html'; }
  });
}

document.addEventListener('DOMContentLoaded', () => {
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

  // existing burger/menu code is already set up earlier
});

// update auth UI if token changes in other tabs
window.addEventListener('storage', (e) => { if (e.key === 'token') updateAuthNav(); });