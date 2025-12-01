document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const ordersBox = document.getElementById('orders');

  async function loadMyOrders() {
    if (!token || token === "null") {
      ordersBox.innerHTML = `<p>You must <a href="login.html">log in</a> to see your orders.</p>`;
      return;
    }

    const res = await fetch('/api/orders/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      ordersBox.innerHTML = `<p>Error loading orders (${res.status})</p>`;
      return;
    }

    const list = await res.json();
    if (!list.length) {
      ordersBox.innerHTML = `<p>No orders yet.</p>`;
      return;
    }

    ordersBox.innerHTML = list.map(o => `
      <div class="order-card">
        <h3>Order #${o.id}</h3>
        <div class="order-meta">
          <strong>Total:</strong> ${o.total} Lei<br>
          <strong>Status:</strong> ${o.status}
        </div>
      </div>
    `).join('');
  }

  document.getElementById('order-form').addEventListener('submit', async e => {
    e.preventDefault();

    if (!token || token === "null") {
      alert("Please log in first");
      return;
    }

    const pid = document.getElementById('pid').value.trim();
    const total = Number(document.getElementById('total').value);

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        total,
        items: [{ product_id: pid, qty: 1 }]
      })
    });

    if (!res.ok) {
      alert("Failed: " + await res.text());
      return;
    }

    alert("Order placed successfully!");
    loadMyOrders();
  });

  loadMyOrders();
});
