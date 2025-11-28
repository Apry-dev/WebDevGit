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
      if (!data.token) return alert('Login failed');
      localStorage.setItem('token', data.token);
      window.location = 'account.html';
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  });
});
