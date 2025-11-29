// (call when clicking "Add to favourites")
async function addFavourite(productId) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/products/${productId}/favourites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
  });
  if (res.status === 401) return alert('Log in to favorite items');
  if (!res.ok) return alert('Failed: ' + (await res.text()));
  alert('Added to favourites');
}