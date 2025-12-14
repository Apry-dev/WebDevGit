document.addEventListener("DOMContentLoaded", async () => {
  const ordersEl = document.getElementById("orders");
  const token = localStorage.getItem("token");

  if (!token) {
    ordersEl.innerHTML =
      `<div class="empty">
        <p>You must <a href="login.html">log in</a> to see your orders.</p>
       </div>`;
    return;
  }

  async function loadOrders() {
    const res = await fetch("/api/orders/me", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      ordersEl.innerHTML = "<p>Failed to load orders.</p>";
      return;
    }

    const orders = await res.json();

    if (!orders.length) {
      ordersEl.innerHTML = `
        <div class="empty">
          <p>You haven’t placed any orders yet.</p>
        </div>
      `;
      return;
    }

    ordersEl.innerHTML = orders.map(o => `
      <div class="order-card">
        <div class="order-meta">
          <div><strong>Product:</strong> ${o.product_name}</div>
          <div><strong>Artisan:</strong> ${o.artisan_name}</div>
          <div><strong>Quantity:</strong> ${o.quantity}</div>
          <div><strong>Total:</strong> ${o.total} RON</div>
        </div>

        <span class="status ${o.status}">${o.status}</span>

        ${
          o.status === "pending"
            ? `<div class="order-actions">
                 <button class="cancel-btn" data-id="${o.id}">
                   Cancel Order
                 </button>
               </div>`
            : ""
        }
      </div>
    `).join("");

    attachCancelHandlers();
  }

  function attachCancelHandlers() {
    document.querySelectorAll(".cancel-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;

        const ok = confirm("Are you sure you want to cancel this order?");
        if (!ok) return;

        const res = await fetch(`/api/orders/${id}/cancel`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          loadOrders();
        } else {
          alert("Failed to cancel order.");
        }
      });
    });
  }

  loadOrders();
});
