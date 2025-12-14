document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');

  // ================= AUTH GUARD =================
  if (!token) {
    window.location.href = 'login.html?next=artisan-dashboard.html';
    return;
  }

  const noArtisan = document.getElementById('no-artisan');
  const panel = document.getElementById('dashboard-panel');
  const productList = document.getElementById('product-list');

  let artisanId = null;
  let myProducts = [];

  // ================= LOAD ARTISAN =================
  try {
    const res = await fetch('/api/artisans/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error('User is not an artisan');
    }

    const artisan = await res.json();

    if (!artisan.id) {
      throw new Error('Invalid artisan payload: missing id');
    }

    artisanId = Number(artisan.id);
    console.log('✅ Artisan loaded, artisanId =', artisanId);

    panel.style.display = 'block';

    // ================= PREFILL PROFILE =================
    const titleEl = document.getElementById('title');
    const craftEl = document.getElementById('craft');
    const addressEl = document.getElementById('address');
    const bioEl = document.getElementById('bio');

    if (titleEl) titleEl.value = artisan.title || '';
    if (craftEl) craftEl.value = artisan.craft || '';
    if (addressEl) addressEl.value = artisan.location || '';
    if (bioEl) bioEl.value = artisan.bio || '';

  } catch (err) {
    console.error('❌ Artisan check failed:', err);
    noArtisan.style.display = 'block';
    return;
  }

  // ================= SAVE PROFILE =================
  const saveBtn = document.getElementById('save-profile');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const payload = {
        title: document.getElementById('title')?.value.trim(),
        craft: document.getElementById('craft')?.value.trim(),
        address: document.getElementById('address')?.value.trim(),
        bio: document.getElementById('bio')?.value.trim()
      };

      try {
        const res = await fetch(`/api/artisans/${artisanId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        alert(res.ok ? 'Profile updated successfully' : 'Failed to update profile');
      } catch (err) {
        console.error(err);
        alert('Network error while updating profile');
      }
    });
  }

  // ================= LOAD PRODUCTS =================
  async function loadProducts() {
    try {
      const res = await fetch(`/api/products?artisanId=${artisanId}`);
      if (!res.ok) throw new Error('Failed to load products');

      myProducts = await res.json();
      renderProducts();

    } catch (err) {
      console.error('❌ Product load failed:', err);
      productList.innerHTML = '<p>Error loading products.</p>';
    }
  }

  // ================= RENDER PRODUCTS =================
  function renderProducts() {
    productList.innerHTML = '';

    if (!myProducts.length) {
      productList.innerHTML = `
        <div class="empty-products">
          <p>No products yet.</p>
          <p>Add your first product to showcase your craft.</p>
        </div>
      `;
      return;
    }

    myProducts.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';

      card.innerHTML = `
        <div class="product-info">
          <strong>${product.name}</strong>
          <p>${product.description || 'Handcrafted product'}</p>
          <span><strong>€${product.price}</strong></span>
        </div>
        <button class="delete-btn" data-id="${product.id}">
          Delete
        </button>
      `;

      productList.appendChild(card);
    });

    bindDeleteButtons();
  }

  // ================= DELETE PRODUCT =================
  function bindDeleteButtons() {
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this product?')) return;

        const productId = btn.dataset.id;

        try {
          const res = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (!res.ok) {
            alert('Failed to delete product');
            return;
          }

          myProducts = myProducts.filter(p => p.id !== Number(productId));
          renderProducts();

        } catch (err) {
          console.error(err);
          alert('Network error while deleting product');
        }
      });
    });
  }

  // ================= ADD PRODUCT =================
  const addProductBtn = document.getElementById('add-product');
  if (addProductBtn) {
    addProductBtn.addEventListener('click', () => {
      window.location.href = 'add-product.html';
    });
  }

  // ================= INIT =================
  loadProducts();
});
