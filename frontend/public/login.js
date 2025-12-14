document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.msg || "Login failed");
        return;
      }

      const token =
        data.token ||
        data.accessToken ||
        data.jwt ||
        data?.user?.token;

      if (!token) {
        console.error("No token returned from backend:", data);
        alert("Login failed: invalid server response");
        return;
      }

      localStorage.setItem("token", token);

      const params = new URLSearchParams(window.location.search);
      const next = params.get("next");

      window.location.href = next || "index.html";

    } catch (err) {
      console.error("Login error:", err);
      alert("Network error");
    }
  });
});
