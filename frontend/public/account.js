const apiBase = '';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
}

/* ================= PROFILE ================= */
async function fetchProfile() {
  const res = await fetch(`${apiBase}/api/auth/me`, { headers: authHeaders() });
  if (!res.ok) throw new Error();
  return res.json();
}

async function updateProfile(payload) {
  return fetch(`${apiBase}/api/users/${payload.id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
}

async function deleteAccount(id) {
  return fetch(`${apiBase}/api/users/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

/* ================= FEEDBACK ================= */
function showFeedback(msg, isError = false) {
  const el = document.getElementById('feedback');
  el.style.color = isError ? '#b33' : '#2a7';
  el.textContent = msg;
  setTimeout(() => (el.textContent = ''), 4000);
}

/* ================= ARTISAN NAV BUTTON ================= */
async function setupArtisanMenu() {
  const slot = document.getElementById('artisan-nav-slot');
  if (!slot) return;

  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch('/api/artisans/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      slot.innerHTML = `<a href="artisan-dashboard.html">My Dashboard</a>`;
    } else {
      slot.innerHTML = `<a href="join-artisan.html">Become an Artisan</a>`;
    }
  } catch (err) {
    console.error(err);
  }
}


/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', async () => {
  setupArtisanMenu();

  try {
    const user = await fetchProfile();
    document.getElementById('name').value = user.username || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('account-form').dataset.userid = user.id;
  } catch {
    window.location.href = 'login.html';
  }
});

/* ================= SAVE ================= */
document.getElementById('account-form').addEventListener('submit', async e => {
  e.preventDefault();

  const id = e.target.dataset.userid;
  const username = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('passwordConfirm').value;

  if (password && password !== confirm) {
    return showFeedback('Passwords do not match', true);
  }

  const payload = { id, username, email };
  if (password) payload.password = password;

  const res = await updateProfile(payload);
  res.ok
    ? showFeedback('Profile updated successfully')
    : showFeedback('Update failed', true);
});

/* ================= ACTIONS ================= */
document.getElementById('logout-btn').onclick = () => {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
};

document.getElementById('delete-btn').onclick = async () => {
  if (!confirm('Delete your account permanently?')) return;
  const id = document.getElementById('account-form').dataset.userid;
  const res = await deleteAccount(id);
  if (res.ok) {
    localStorage.removeItem('token');
    window.location.href = 'signup.html';
  } else {
    showFeedback('Delete failed', true);
  }
};
