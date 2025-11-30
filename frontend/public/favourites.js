document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token || token === 'null' || token === 'undefined') {
    // protect the page client-side + show next step to login
    document.getElementById('content').innerHTML = `<p>You must <a href="login.html?next=favourites.html">log in</a> to view your favourites.</p>`;
    return;
  }

  // attempt to get favourites (server route may be GET /api/users/me/favourites or similar)
  const res = await fetch('/api/users/me/favourites', { headers: { Authorization: `Bearer ${token}` } });
  if (res.status === 401) {
    document.getElementById('content').innerHTML = '<p>Unauthorized — server protected this route (expected).</p>';
    return;
  }
  if (!res.ok) {
    document.getElementById('content').innerHTML = `<p>Could not load favourites: ${await res.text()}</p>`;
    return;
  }
  const list = await res.json();
  if (!list.length) {
    document.getElementById('content').innerHTML = '<p>You have no favourites yet.</p>';
    return;
  }
  document.getElementById('content').innerHTML = list.map(a => `
    <div class="fav-card">
      <img src="${a.icon || 'assets/icons/pottery.png'}" width="48" />
      <strong>${a.title || a.name}</strong>
      <div>${a.craft || a.bio || ''}</div>
      <div style="font-size:0.9rem;color:#666">${a.location || ''}</div>
    </div>
  `).join('');