document.addEventListener('DOMContentLoaded', loadFavourites);

async function loadFavourites() {
  const container = document.getElementById('content');
  const token = localStorage.getItem('token');

  if (!token || token === 'null' || token === 'undefined') {
    container.innerHTML = `
      <p style="grid-column:1/-1;text-align:center;">
        You must <a href="login.html?next=favourites.html">log in</a> to view your favourites.
      </p>
    `;
    return;
  }

  let res;
  try {
    res = await fetch('/api/users/me/favourites', {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch {
    container.innerHTML = `<p style="grid-column:1/-1;">Network error.</p>`;
    return;
  }

  if (!res.ok) {
    container.innerHTML = `<p style="grid-column:1/-1;">Failed to load favourites.</p>`;
    return;
  }

  const list = await res.json();

  if (!list.length) {
    container.innerHTML = `
      <p style="grid-column:1/-1;text-align:center;color:#666;">
        You have no favourites yet.
      </p>
    `;
    return;
  }

  container.innerHTML = list.map(item => `
    <article style="
      background:#fff;
      border-radius:16px;
      padding:1.4rem;
      box-shadow:0 10px 24px rgba(0,0,0,0.07);
      display:flex;
      gap:1.2rem;
      align-items:center;
    ">

      <img
        src="${item.icon || 'assets/icons/pottery.png'}"
        alt="${item.craft || 'artisan'}"
        style="
          width:90px;
          height:90px;
          border-radius:14px;
          object-fit:cover;
        "
      />

      <div style="flex:1;">
        <h3 style="margin:0 0 0.3rem 0;">${item.title}</h3>
        <div style="color:#666;font-size:0.95rem;">
          ${item.craft || ''}
        </div>
        <div style="color:#888;font-size:0.85rem;margin-top:0.3rem;">
          ${item.location || ''}
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:0.6rem;">
        <button
          onclick="goToArtisan(${item.id})"
          style="
            padding:0.45rem 0.9rem;
            background:#f2f2f2;
            border:none;
            border-radius:8px;
            cursor:pointer;
          ">
          View profile
        </button>

        <button
          onclick="removeFavourite(${item.id})"
          style="
            padding:0.45rem 0.9rem;
            background:#b33;
            color:white;
            border:none;
            border-radius:8px;
            cursor:pointer;
          ">
          Remove
        </button>
      </div>

    </article>
  `).join('');
}

function goToArtisan(id) {
  window.location.href = `artisan.html?id=${id}`;
}

async function removeFavourite(id) {
  const token = localStorage.getItem('token');

  const res = await fetch(`/api/artisans/${id}/favourites`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    alert('Failed to remove favourite');
    return;
  }

  loadFavourites();
}
