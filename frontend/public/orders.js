// orders.js — FINAL (aligned with backend orderController)

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  // ================= AUTH GUARD =================
  if (!token) {
    window.location.href = "login.html?next=orders.html";
    return;
  }

  const list = document.getElementById("orders-list");

  if (!list) {
    console.error("orders-list element not found");
    return;
  }

  try {
    // ✅ CORRECT ENDPOINT
    const res = await fetch("/api/orders/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("Failed to load orders");
    }

    const orders = await res.json();

    // ================= EMPTY STATE =================
    if (!orders.length) {
      list.innerHTML = `
        <p style="text-align:center; color:#555;">
          You have no orders yet.
        </p>
      `;
      return;
    }

    // ================= RENDER ORDERS =================
    orders.forEach(o => {
      const card = document.createElement("div");

      card.style.cssText = `
        background:#fff;
        padding:1.6rem;
        border-radius:16px;
        box-shadow:0 10px 25px rgba(0,0,0,0.08);
        margin-bottom:1.2rem;
      `;

      const date = new Date(o.created_at).toLocaleDateString();

      card.innerHTML = `
        <h4 style="font-family:'Playfair Display',serif; margin-bottom:0.4rem;">
          ${o.product_name}
        </h4>

        <p style="color:#666; margin-bottom:0.4rem;">
          Artisan: <strong>${o.artisan_name}</strong>
        </p>

        <p>Quantity: <strong>${o.quantity}</strong></p>
        <p>Total: <strong>€${o.total}</strong></p>
        <p>Status: <strong>${o.status}</strong></p>

        <p style="font-size:0.85rem; color:#777;">
          Ordered on ${date}
        </p>

        ${
          o.status === "pending"
            ? `<button
                class="cancel-order-btn"
                data-id="${o.id}"
                style="
                  margin-top:0.8rem;
                  padding:0.45rem 1.1rem;
                  border-radius:999px;
                  border:1px solid #b33;
                  background:#fff;
                  color:#b33;
                  cursor:pointer;
                  font-size:0.85rem;
                "
              >
                Cancel Order
              </button>`
            : ""
        }
      `;

      list.appendChild(card);
    });

    // ================= CANCEL HANDLER (ADDED) =================
    document.querySelectorAll(".cancel-order-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const orderId = btn.dataset.id;

        if (!confirm("Are you sure you want to cancel this order?")) return;

        try {
          const res = await fetch(`/api/orders/${orderId}/cancel`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (!res.ok) {
            alert("Failed to cancel order");
            return;
          }

          // Remove card from UI
          btn.closest("div").remove();
        } catch (err) {
          console.error(err);
          alert("Error cancelling order");
        }
      });
    });

  } catch (err) {
    console.error("❌ Orders load failed:", err);
    list.innerHTML = `
      <p style="text-align:center; color:#b33;">
        Failed to load orders.
      </p>
    `;
  }
});
