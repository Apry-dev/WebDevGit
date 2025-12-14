document.addEventListener('DOMContentLoaded', async () => {
  const ordersEl = document.getElementById('orders');
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = 'login.html?next=artisan-orders.html';
    return;
  }

  // ================= LOAD ORDERS =================
  let orders = [];
  try {
    const res = await fetch('/api/orders/artisan', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error();
    orders = await res.json();
  } catch {
    ordersEl.innerHTML = '<p>Failed to load orders.</p>';
    return;
  }

  if (!orders.length) {
    ordersEl.innerHTML = `
      <div class="empty-orders">
        <p>No incoming orders yet.</p>
        <p>Orders placed for your products will appear here.</p>
      </div>
    `;
    return;
  }

  renderOrders(orders);

  // ================= RENDER =================
  function renderOrders(data) {
    ordersEl.innerHTML = data.map(o => `
      <div class="order-card">
        <div class="order-header">
          <h3>Order #${o.id}</h3>
          <span class="status ${o.status}">${o.status}</span>
        </div>

        <div class="order-meta">
          <div><strong>Product:</strong> ${o.product_name}</div>
          <div><strong>Customer:</strong> ${o.customer_name}</div>
          <div><strong>Quantity:</strong> ${o.quantity}</div>
          <div><strong>Total:</strong> ${o.total_price} RON</div>
        </div>

        ${renderActions(o)}
      </div>
    `).join('');

    attachActions();
  }

  function renderActions(order) {
    if (order.status === 'pending') {
      return `
        <div class="order-actions">
          <button class="accept-btn" data-id="${order.id}">Accept</button>
          <button class="reject-btn" data-id="${order.id}">Reject</button>
        </div>
      `;
    }
    if (order.status === 'accepted') {
      return `
        <div class="order-actions">
          <button class="ship-btn" data-id="${order.id}">Mark as shipped</button>
        </div>
      `;
    }
    return '';
  }

  // ================= ACTION HANDLERS =================
  function attachActions() {
    document.querySelectorAll('.accept-btn').forEach(btn => {
      btn.onclick = () => updateStatus(btn.dataset.id, 'accepted');
    });

    document.querySelectorAll('.reject-btn').forEach(btn => {
      btn.onclick = () => updateStatus(btn.dataset.id, 'rejected');
    });

    document.querySelectorAll('.ship-btn').forEach(btn => {
      btn.onclick = () => updateStatus(btn.dataset.id, 'shipped');
    });
  }

  async function updateStatus(id, status) {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    if (res.ok) location.reload();
    else alert('Failed to update order');
  }
});
