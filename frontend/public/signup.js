document.getElementById('signup-form').addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirm').value;
  if (password !== confirm) return alert('Passwords do not match');

  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // backend expects "name", not "username"
    body: JSON.stringify({ name, email, password })
  });

  const body = await res.json().catch(()=>({msg:'Signup failed'}));
  if (!res.ok) return alert(body.msg || 'Signup failed');
  alert('Signup successful, please log in');
  window.location = 'login.html';
});