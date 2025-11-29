document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        alert(body.msg || 'Login failed');
        return;
      }
      const data = await res.json();
      // store token
      if (data.token) localStorage.setItem('token', data.token);

      // Redirect to homepage by default (or to ?next=... if provided)
      const params = new URLSearchParams(window.location.search);
      const next = params.get('next');
      window.location.href = next ? next : 'index.html';
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  });
});
