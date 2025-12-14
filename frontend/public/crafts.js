document.addEventListener('DOMContentLoaded', () => {
  const q = document.getElementById('q');
  const listEl = document.getElementById('list');
  const filter = document.getElementById('filterCraft');
  const artisanNavSlot = document.getElementById('artisan-nav-slot');

  let artisans = [];

  /* ================= ARTISAN NAV (CRAFTS PAGE ONLY) ================= */
async function setupArtisanNavbar() {
  if (!artisanNavSlot) return;

  const token = localStorage.getItem('token');

  // Not logged in → show nothing
  if (!token || token === 'null' || token === 'undefined') {
    artisanNavSlot.innerHTML = '';
    return;
  }

  try {
    const res = await fetch('/api/artisans/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Logged in AND artisan
    if (res.ok) {
      artisanNavSlot.innerHTML = `
        <a href="artisan-dashboard.html">Dashboard</a>
      `;
    }
    // Logged in but NOT artisan
    else {
      artisanNavSlot.innerHTML = `
        <a href="join-artisan.html">Join as artisan</a>
      `;
    }
  } catch (err) {
    console.error('Artisan nav check failed', err);
    artisanNavSlot.innerHTML = '';
  }
}

  /* ================= DATA LOAD ================= */
  async function loadAll() {
<<<<<<< HEAD
    listEl.innerHTML = '<p style="text-align:center;color:#666;">Loading artisans…</p>';

    try {
      const res = await fetch('/api/artisans');
      if (!res.ok) {
        listEl.innerHTML = `<p>Error ${res.status}</p>`;
        return;
      }

      artisans = await res.json();

      // Load user's favourites (if logged in)
      let favSet = new Set();
      const token = localStorage.getItem('token');

      if (token && token !== 'null' && token !== 'undefined') {
        try {
          const r = await fetch('/api/users/me/favourites', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (r.ok) {
            const favList = await r.json();
            favSet = new Set(favList.map(f => Number(f.id)));
          }
        } catch (_) {}
      }

      populateFilter();
      applyFilters(favSet);
    } catch (err) {
      console.error(err);
      listEl.innerHTML = '<p>Network error</p>';
    }
  }

  /* ================= FILTER LOGIC ================= */
  function applyFilters(favSet = new Set()) {
    const query = q.value.trim().toLowerCase();
    const craftVal = filter.value.toLowerCase();

    const filtered = artisans.filter(a => {
      const name = (a.title || a.name || '').toLowerCase();
      const craft = (a.craft || a.bio || '').toLowerCase();
      const location = (a.location || '').toLowerCase();

      const matchesText =
        !query ||
        name.includes(query) ||
        craft.includes(query) ||
        location.includes(query);

      const matchesCraft =
        !craftVal || craft.includes(craftVal);

      return matchesText && matchesCraft;
    });

    renderCards(filtered, favSet);
  }

  /* ================= RENDER ================= */
  function renderCards(data, favSet = new Set()) {
    if (!data.length) {
      listEl.innerHTML = '<p style="text-align:center;color:#777;">No results found.</p>';
      return;
    }

    listEl.innerHTML = data.map(a => {
      const name = a.title || a.name || 'Unknown artisan';
      const craft = a.craft || a.bio || 'Craft';
      const location = a.location || 'Romania';
      const icon = a.icon || 'assets/icons/pottery.png';
      const isFav = favSet.has(Number(a.id));

      return `
        <article style="background:#fff;padding:1.25rem;border-radius:14px;box-shadow:0 8px 22px rgba(0,0,0,0.06);">
          <div style="display:flex;gap:0.75rem;align-items:center;">
            <img src="${icon}" alt="${craft}" style="width:64px;height:64px;border-radius:10px;object-fit:cover;">
            <div style="flex:1;">
              <strong style="font-size:1.05rem;display:block;">${name}</strong>
              <span style="font-size:0.9rem;color:#666;">${craft}</span>
              <div style="font-size:0.85rem;color:#888;margin-top:0.25rem;">${location}</div>
            </div>
          </div>

          <p style="margin-top:0.9rem;color:#444;font-size:0.9rem;line-height:1.45;">
            ${escapeHtml(a.bio && a.bio !== a.craft ? a.bio : '')}
          </p>

          <div style="margin-top:1rem;display:flex;justify-content:space-between;align-items:center;">
            <div>
              <a href="index.html#map" style="font-size:0.85rem;padding:0.4rem 0.7rem;border-radius:7px;background:#f2f2f2;color:#333;text-decoration:none;">
                View on map
              </a>
              <a href="join-artisan.html" style="font-size:0.85rem;padding:0.4rem 0.7rem;border-radius:7px;background:#556B2F;color:#fff;text-decoration:none;margin-left:0.3rem;">
                Contact
              </a>
            </div>

            <button
              class="fav-btn"
              data-id="${a.id}"
              aria-pressed="${isFav}"
              style="background:none;border:none;font-size:1.4rem;cursor:pointer;color:#c2a500;">
              ${isFav ? '★' : '☆'}
            </button>
          </div>
        </article>
      `;
    }).join('');

    attachFavHandlers();
  }

  /* ================= EVENTS ================= */
  q.addEventListener('input', () => applyFilters());
  filter.addEventListener('change', () => applyFilters());
  btn.addEventListener('click', () => applyFilters());

  /* ================= HELPERS ================= */
  function attachFavHandlers() {
    listEl.querySelectorAll('.fav-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = 'login.html?next=crafts.html';
          return;
        }

        const isFav = btn.getAttribute('aria-pressed') === 'true';

        try {
          const res = await fetch(`/api/artisans/${id}/favourites`, {
            method: isFav ? 'DELETE' : 'POST',
            headers: { Authorization: `Bearer ${token}` }
          });

          if (!res.ok) {
            alert('Action failed');
            return;
          }

          btn.textContent = isFav ? '☆' : '★';
          btn.setAttribute('aria-pressed', String(!isFav));
        } catch {
          alert('Network error');
        }
      });
    });
  }

  function populateFilter() {
    const set = new Set();
    artisans.forEach(a => {
      const c = (a.craft || a.bio || '').toLowerCase().trim();
      if (c) set.add(c);
    });

    filter.innerHTML =
      '<option value="">All crafts</option>' +
      Array.from(set).sort().map(c =>
        `<option value="${c}">${c}</option>`
      ).join('');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, m =>
      ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[m])
    );
  }

  /* ================= INIT ================= */
  setupArtisanNavbar();
=======
    listEl.innerHTML = 'Loading…';
    const res = await fetch('/api/artisans');
    artisans = await res.json();
    populateFilter();
    renderCards(artisans);
  }

  function renderCards(data) {
    listEl.innerHTML = data.map(a => `
      <article style="
        background:#fff;
        border-radius:14px;
        padding:1.2rem;
        box-shadow:0 10px 25px rgba(0,0,0,0.08);
        display:flex;
        flex-direction:column;
        gap:0.75rem;
      ">
        <div style="display:flex;gap:0.75rem;align-items:center;">
          <img src="${a.icon || 'assets/icons/pottery.png'}"
               style="width:56px;height:56px;border-radius:10px;">
          <div>
            <strong style="font-size:1.05rem;">${a.title || a.name}</strong>
            <div style="font-size:0.85rem;color:#666;">${a.craft || ''}</div>
            <div style="font-size:0.8rem;color:#999;">${a.location || ''}</div>
          </div>
        </div>

        ${a.bio ? `<p style="font-size:0.9rem;color:#555;line-height:1.5;">${a.bio}</p>` : ''}

        <div style="margin-top:auto;display:flex;gap:0.5rem;justify-content:flex-end;">
          <a href="index.html#map"
             style="padding:0.45rem 0.7rem;border-radius:8px;background:#f1f1f1;text-decoration:none;color:#333;">
            View map
          </a>
          <a href="join-artisan.html"
             style="padding:0.45rem 0.8rem;border-radius:8px;background:#556B2F;color:#fff;text-decoration:none;">
            Contact
          </a>
        </div>
      </article>
    `).join('');
  }

  function populateFilter() {
    const crafts = [...new Set(artisans.map(a => (a.craft || '').toLowerCase()).filter(Boolean))];
    filter.innerHTML =
      '<option value="">All crafts</option>' +
      crafts.map(c => `<option value="${c}">${c}</option>`).join('');
  }

  function applyFilters() {
    const query = q.value.toLowerCase();
    const craft = filter.value;

    const filtered = artisans.filter(a => {
      const haystack = `${a.name} ${a.title} ${a.craft} ${a.location}`.toLowerCase();
      return (!query || haystack.includes(query)) &&
             (!craft || (a.craft || '').toLowerCase().includes(craft));
    });

    renderCards(filtered);
  }

  q.addEventListener('input', applyFilters);
  filter.addEventListener('change', applyFilters);

>>>>>>> origin/main
  loadAll();
});
