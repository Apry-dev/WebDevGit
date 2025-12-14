document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html?next=artisan-dashboard.html';
    return;
  }

  const noArtisan = document.getElementById('no-artisan');
  const panel = document.getElementById('dashboard-panel');

  let artisan;

  // ================= LOAD ARTISAN =================
  try {
    const res = await fetch('/api/artisans/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error();
    artisan = await res.json();
  } catch {
    noArtisan.style.display = 'block';
    return;
  }

  panel.style.display = 'block';

  // ================= PREFILL =================
  const titleEl = document.getElementById('title');
  const craftEl = document.getElementById('craft');
  const addressEl = document.getElementById('address');
  const bioEl = document.getElementById('bio');

  titleEl.value = artisan.title || '';
  craftEl.value = artisan.craft || '';
  addressEl.value = artisan.location || '';
  bioEl.value = artisan.bio || '';

  // ================= SAVE PROFILE =================
  document.getElementById('save-profile').addEventListener('click', async () => {
    const payload = {
      title: titleEl.value.trim(),
      craft: craftEl.value.trim(),
      address: addressEl.value.trim(),
      bio: bioEl.value.trim()
    };

    const res = await fetch(`/api/artisans/${artisan.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    alert(res.ok ? 'Profile updated successfully' : 'Failed to update profile');
  });

  // ================= LOAD PRODUCTS =================
  const productList = document.getElementById('product-list');

  const pRes = await fetch(`/api/products?artisanId=${artisan.id}`);
  const products = pRes.ok ? await pRes.json() : [];

  if (!products.length) {
    productList.innerHTML = `
      <div class="empty-products">
        <p>No products yet.</p>
        <p>Add your first product to showcase your craft.</p>
      </div>
    `;
  } else {
    productList.innerHTML = products.map(p => `
      <div class="product-card">
        <div>
          <strong>${p.name}</strong><br>
          ${p.price} RON
        </div>
        <button class="delete-btn" data-id="${p.id}">Delete</button>
      </div>
    `).join('');
  }

  // ================= DELETE PRODUCT =================
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Delete this product?')) return;

      const res = await fetch(`/api/products/${btn.dataset.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) location.reload();
    });
  });

  // ================= ADD PRODUCT =================
  document.getElementById('add-product').onclick = () => {
    window.location.href = 'add-product.html';
  };
});
