const apiBase = ''; // if backend runs on same origin, otherwise e.g. 'http://localhost:4000'

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

async function fetchProfile() {
  const res = await fetch(`${apiBase}/api/auth/me`, { headers: authHeaders() });
  if (!res.ok) throw res;
  return res.json();
}

async function updateProfile(payload) {
  const res = await fetch(`${apiBase}/api/users/${payload.id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return res;
}

async function deleteAccount(id) {
  return fetch(`${apiBase}/api/users/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

function showFeedback(msg, isError = false) {
  const el = document.getElementById('feedback');
  el.style.color = isError ? '#b33' : '#2a7';
  el.textContent = msg;
  setTimeout(()=> el.textContent = '', 4000);
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const user = await fetchProfile();
    document.getElementById('name').value = user.name || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('account-form').dataset.userid = user._id || user.id;
  } catch (err) {
    console.error(err);
    // Not logged in -> redirect to login
    window.location.href = 'login.html';
  }
});

document.getElementById('account-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = e.currentTarget.dataset.userid;
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('passwordConfirm').value;
  if (password && password !== passwordConfirm) return showFeedback('Passwords do not match', true);

  const payload = { id, name, email };
  if (password) payload.password = password;

  const res = await updateProfile(payload);
  if (res.ok) {
    showFeedback('Profile updated');
    // Optionally refresh token/user info
  } else {
    const body = await res.json().catch(()=>({msg:'Server error'}));
    showFeedback(body.msg || 'Update failed', true);
  }
});

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
});

document.getElementById('delete-btn').addEventListener('click', async () => {
  if (!confirm('Delete your account? This cannot be undone.')) return;
  const id = document.getElementById('account-form').dataset.userid;
  const res = await deleteAccount(id);
  if (res.ok) {
    localStorage.removeItem('token');
    window.location.href = 'signup.html';
  } else {
    const body = await res.json().catch(()=>({msg:'Delete failed'}));
    showFeedback(body.msg || 'Delete failed', true);
  }
});