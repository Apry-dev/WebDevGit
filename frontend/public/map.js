function initMap() {
  const romania = { lat: 45.9432, lng: 24.9668 };

  // 🔹 Creează harta, centrată pe România
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7.3,
    center: romania,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    gestureHandling: "greedy",
    backgroundColor: "#f8f8f8",
  });

  // 🔹 Stil personalizat - culori mai pronunțate + bordere clare
  const styledMap = [
    { elementType: "geometry", stylers: [{ color: "#ebe6e0" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#2e2e2e" }] },
    {
      featureType: "administrative.country",
      elementType: "geometry.stroke",
      stylers: [
        { visibility: "on" },
        { color: "#333333" },
        { weight: 1.5 },
      ],
    },
    {
      featureType: "administrative.province",
      elementType: "geometry.stroke",
      stylers: [
        { visibility: "on" },
        { color: "#666666" },
        { weight: 0.7 },
      ],
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry.fill",
      stylers: [{ color: "#f2eee7" }],
    },
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [{ color: "#a8c7de" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#cccccc" }],
    },
    { featureType: "poi", stylers: [{ visibility: "off" }] },
  ];

  map.setOptions({ styles: styledMap });

  // 🔹 Lista de artizani (ceramică 🏺, croitorie 🧵, costume 🎭)
  const artisans = [
    {
      position: { lat: 46.77, lng: 23.59 },
      title: "Cluj Pottery Workshop",
      icon: "./assets/icons/pottery.png",
    },
    {
      position: { lat: 44.43, lng: 26.10 },
      title: "Bucharest Embroidery Studio",
      icon: "./assets/icons/sewing.png",
    },
    {
      position: { lat: 47.16, lng: 27.58 },
      title: "Iași Weaving Atelier",
      icon: "./assets/icons/sewing.png",
    },
    {
      position: { lat: 45.80, lng: 24.15 },
      title: "Sibiu Ceramic Collective",
      icon: "./assets/icons/pottery.png",
    },
    {
      position: { lat: 46.55, lng: 24.56 },
      title: "Târgu Mureș Traditional Costume Atelier",
      icon: "./assets/icons/costumes.png",
    },
    {
      position: { lat: 45.02, lng: 24.88 },
      title: "Râmnicu Vâlcea Folk Dress Studio",
      icon: "./assets/icons/costumes.png",
    },
    {
      position: { lat: 47.65, lng: 23.58 },
      title: "Maramureș Folk Clothing Workshop",
      icon: "./assets/icons/costumes.png",
    },
  ];

  // fetch artisan records from API — fallback to hardcoded list if error
  async function loadRemoteArtisans() {
    try {
      const res = await fetch('/api/artisans');
      if (!res.ok) throw new Error('no data');
      const list = await res.json();
      return list.map(a => ({
        position: { lat: Number(a.lat), lng: Number(a.lng) },
        title: a.title || a.username || 'Artisan',
        icon: a.icon || `./assets/icons/${a.craft || 'pottery'}.png`
      }));
    } catch (e) {
      console.warn('Failed to load artisans from API, using fallback', e);
      return artisans; // previously declared fallback array
    }
  }

  // replace artisans.forEach(...) after fetch
  loadRemoteArtisans().then(list => {
    list.forEach((artisan) => {
      // create marker as before
      const marker = new google.maps.Marker({
        position: artisan.position,
        map,
        title: artisan.title,
        icon: {
          url: artisan.icon,
          scaledSize: artisan.icon.includes("sewing") ? new google.maps.Size(36, 36)
            : artisan.icon.includes("costumes") ? new google.maps.Size(44, 44)
            : new google.maps.Size(42, 42),
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<div style="font-family:Inter;font-size:14px;"><strong>${artisan.title}</strong></div>`,
      });

      marker.addListener("click", () => infoWindow.open(map, marker));
    });
  });
}

// 🔹 Încarcă scriptul Google Maps cu API key-ul tău
const script = document.createElement("script");
script.src =
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyCRL61vFE0NYxdJ7h3CSh7AeTqLkfYU_bY&callback=initMap";
script.async = true;
document.head.appendChild(script);
