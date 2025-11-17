// ===== BURGER MENU FUNCTIONALITY =====
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  navLinks.classList.toggle("active");
});

// 🔹 Închide automat meniul când dai click pe un link
document.querySelectorAll("#nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active");
    navLinks.classList.remove("active");
  });
});

// ===== AUTH-AWARE NAVBAR =====
function updateAuthNav() {
  const token = localStorage.getItem('token');
  // Only modify anchor elements with class `login-btn` (avoid buttons used as Back)
  document.querySelectorAll('a.login-btn').forEach(a => {
    if (token) {
      a.textContent = 'My Account';
      a.href = 'account.html';
    } else {
      a.textContent = 'Log In';
      a.href = 'login.html';
    }
  });
}

// update on load and when localStorage changes (other tabs)
document.addEventListener('DOMContentLoaded', updateAuthNav);
window.addEventListener('storage', (e) => {
  if (e.key === 'token') updateAuthNav();
});