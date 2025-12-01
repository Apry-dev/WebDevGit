document.addEventListener('DOMContentLoaded', loadFavourites);

async function loadFavourites() {
  const container = document.getElementById('content');
  const token = localStorage.getItem('token');

  if (!token || token === 'null' || token === 'undefined') {
    container.innerHTML = `
      <p>You must <a href="login.html?next=favourites.html">log in</a> to view your favourites.</p>
    `;
    return;
  }

  // fetch user favourites
  let res;
  try {
    res = await fetch('/api/users/me/favourites', {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (err) {
    container.innerHTML = `<p>Network error.</p>`;
    return;
  }

  if (!res.ok) {
    container.innerHTML = `<p>Error loading favourites.</p>`;
    return;
  }

  const list = await res.json();

  if (!list.length) {
    container.innerHTML = '<p>You have no favourites yet.</p>';
    return;
  }

  // render cards
  container.innerHTML = list.map(item => `
    <article class="fav-card" 
      style="
        background:white;
        border:1px solid #ddd;
        border-radius:10px;
        padding:1rem;
        margin-bottom:1rem;
        display:flex;
        gap:1rem;
        align-items:center;
      ">
      
      <img src="${item.icon || 'assets/icons/pottery.png'}" 
           alt="${item.craft}"
           style="width:80px;height:80px;border-radius:10px;object-fit:cover;">
      
      <div style="flex:1;">
        <h3 style="margin:0;">${item.title}</h3>
        <p style="color:#666;margin:0.25rem 0;">${item.craft || ''}</p>
        <p style="color:#888;font-size:0.9rem;margin:0;">${item.location || ''}</p>
      </div>

      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        <button onclick="goToArtisan(${item.id})"
          style="
            padding:0.4rem 0.8rem;
            background:#556B2F;
            color:white;
            border:none;
            border-radius:6px;
          ">
          View
        </button>

        <button onclick="removeFavourite(${item.id})"
          style="
            padding:0.4rem 0.8rem;
            background:#8B0000;
            color:white;
            border:none;
            border-radius:6px;
          ">
          Remove
        </button>
      </div>

    </article>
  `).join('');
}

// navigate to artisan section
function goToArtisan(id) {
  window.location.href = `crafts.html#id=${id}`;
}

// DELETE favourite
async function removeFavourite(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/artisans/${id}/favourites`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    alert('Could not remove');
    return;
  }

  loadFavourites();
}

// logout
function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}
