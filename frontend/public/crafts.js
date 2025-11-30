document.addEventListener('DOMContentLoaded', () => {
  const q = document.getElementById('q');
  const btn = document.getElementById('search');
  const listEl = document.getElementById('list');
  const filter = document.getElementById('filterCraft');

  let artisans = [];

  async function loadAll() {
    listEl.innerHTML = 'Loading...';
    try {
      const res = await fetch('/api/artisans');
      if (!res.ok) { listEl.innerHTML = `<p>Error ${res.status}</p>`; return; }
      artisans = await res.json();

      // Load user's favourites (if logged in)
      let favSet = new Set();
      const token = localStorage.getItem('token');
      if (token && token !== 'null' && token !== 'undefined') {
        try {
          const r = await fetch('/api/users/me/favourites', { headers: { Authorization: `Bearer ${token}` } });
          if (r.ok) {
            const favList = await r.json();
            favSet = new Set(favList.map(f => Number(f.id)));
          }
        } catch(e) { console.warn('Failed to load favourites', e); }
      }
      populateFilter();
      renderCards(artisans, favSet);
    } catch (err) {
      listEl.innerHTML = `<p>Network error</p>`;
      console.error(err);
    }
  }

  function renderCards(data, favSet = new Set()) {
    // populate star button and attach handlers after DOM update
    listEl.innerHTML = data.map(a => {
      const name = a.title || a.name || 'Unknown';
      const craft = a.craft || a.bio || '—';
      const location = a.location || '—';
      const icon = a.icon || 'assets/icons/pottery.png';
      const isFav = favSet.has(Number(a.id));
      return `
        <article class="card" style="padding:1rem;border-radius:8px;border:1px solid #eee;background:#fff;">
          <div style="display:flex;gap:0.75rem;align-items:center;">
            <img src="${icon}" alt="${craft}" style="width:64px;height:64px;border-radius:8px;object-fit:cover;">
            <div style="flex:1">
              <strong style="display:block;font-size:1.05rem">${name}</strong>
              <div style="font-size:0.9rem;color:#666">${craft}</div>
              <div style="font-size:0.85rem;color:#888;margin-top:6px">${location}</div>
            </div>
          </div>
          <p style="margin-top:0.75rem;color:#444">${a.bio && a.bio !== a.craft ? escapeHtml(a.bio) : ''}</p>
          <div class="card-actions" style="margin-top:0.75rem;display:flex;gap:0.5rem;justify-content:flex-end;">
            <a href="index.html#map" style="padding:0.45rem 0.7rem;border-radius:6px;background:#f1f1f1;color:#333;text-decoration:none;">View on map</a>
            <a href="join-artisan.html" style="padding:0.45rem 0.7rem;border-radius:6px;background:#556B2F;color:#fff;text-decoration:none;">Contact</a>
            <button class="fav-btn" data-id="${a.id}" aria-pressed="${isFav}" style="background:none;border:none;color:#666;font-size:1.2rem;padding:0;">${isFav ? '★' : '☆'}</button>
          </div>
        </article>
      `;
    }).join('');

    // attach listeners
    listEl.querySelectorAll('.fav-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = btn.dataset.id;
        const token = localStorage.getItem('token');
        if (!token) return window.location.href = `login.html?next=crafts.html`;

        const isNowFav = btn.getAttribute('aria-pressed') === 'true';
        try {
          const method = isNowFav ? 'DELETE' : 'POST';
          const res = await fetch(`/api/artisans/${id}/favourites`, { method, headers: { Authorization: `Bearer ${token}` } });
          if (!res.ok) return alert('Action failed: ' + (await res.text()));
          btn.textContent = isNowFav ? '☆' : '★';
          btn.setAttribute('aria-pressed', String(!isNowFav));
        } catch (err) {
          alert('Network error');
        }
      });
    });
  }

  function escapeHtml(s) {
    if (!s) return '';
    return s.replace(/[&<>"']/g, (m) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[m]));
  }

  function populateFilter() {
    const set = new Set();
    artisans.forEach(a => {
      const c = (a.craft || a.bio || '').toString().trim().toLowerCase();
      if (c) set.add(c);
    });
    const opts = Array.from(set).sort();
    // clear and add
    filter.innerHTML = '<option value="">All crafts</option>' + opts.map(o => `<option value="${o}">${o}</option>`).join('');
  }

  btn.addEventListener('click', () => {
    const qv = q.value.trim().toLowerCase();
    const craftVal = filter.value;
    const filtered = artisans.filter(a => {
      const name = (a.title || a.name || '').toString().toLowerCase();
      const craft = (a.craft || a.bio || '').toString().toLowerCase();
      const matchesQ = !qv || name.includes(qv) || craft.includes(qv) || (a.location||'').toLowerCase().includes(qv);
      const matchesCraft = !craftVal || craft.includes(craftVal);
      return matchesQ && matchesCraft;
    });
    renderCards(filtered);
  });

  // initial load
  loadAll();
});