document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    // keep consistent UX: send next param
    window.location.href = 'login.html?next=join-artisan.html';
    return;
  }

  const craftEl = document.getElementById('craft');
  const iconPreview = document.getElementById('icon-preview');
  craftEl.addEventListener('change', () => {
    const option = craftEl.selectedOptions[0];
    const icon = option?.dataset?.icon || '';
    iconPreview.innerHTML = icon ? `<img src="${icon}" width="32" height="32" alt="">` : '';
  });

  const form = document.getElementById('artisan-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const craft = document.getElementById('craft').value;
    const street = document.getElementById('street').value.trim();
    const number = document.getElementById('number').value.trim();
    const city = document.getElementById('city').value.trim();

    if (!title || !craft || !street || !number || !city) {
      return alert('Please fill all fields');
    }

    const address = `${street} ${number}, ${city}, Romania`;

    try {
      const res = await fetch('/api/artisans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, craft, address })
      });

      const body = await res.text(); // read raw
      let parsed;
      try { parsed = JSON.parse(body); } catch(e) { parsed = { msg: body || 'no response body' }; }

      if (!res.ok) {
        const message = parsed.msg || parsed.message || JSON.stringify(parsed);
        document.getElementById('join-feedback').textContent = 'Failed: ' + message;
        console.error('POST /api/artisans failed', res.status, message);
        return;
      }

      // success -> return to homepage where map will show new artisan
      window.location.href = 'index.html';
    } catch (err) {
      console.error(err);
      document.getElementById('join-feedback').textContent = 'Network error';
    }
  });
});