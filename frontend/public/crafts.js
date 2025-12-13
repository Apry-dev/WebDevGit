document.addEventListener('DOMContentLoaded', () => {
  const q = document.getElementById('q');
  const listEl = document.getElementById('list');
  const filter = document.getElementById('filterCraft');

  let artisans = [];

  async function loadAll() {
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

  loadAll();
});
