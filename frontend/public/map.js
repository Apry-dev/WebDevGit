function initMap() {
  const romania = { lat: 45.9432, lng: 24.9668 };

  // ================= MAP INIT =================
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7.3,
    center: romania,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    gestureHandling: "greedy",
    backgroundColor: "#f8f8f8",
  });

  // ================= MAP STYLE =================
  const styledMap = [
    { elementType: "geometry", stylers: [{ color: "#ebe6e0" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#2e2e2e" }] },
    {
      featureType: "administrative.country",
      elementType: "geometry.stroke",
      stylers: [{ visibility: "on" }, { color: "#333333" }, { weight: 1.5 }],
    },
    {
      featureType: "administrative.province",
      elementType: "geometry.stroke",
      stylers: [{ visibility: "on" }, { color: "#666666" }, { weight: 0.7 }],
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

  // ================= FALLBACK ARTISANS =================
  const fallbackArtisans = [
    {
      id: null,
      position: { lat: 46.77, lng: 23.59 },
      title: "Cluj Pottery Workshop",
      icon: "./assets/icons/pottery.png",
    },
    {
      id: null,
      position: { lat: 44.43, lng: 26.1 },
      title: "Bucharest Embroidery Studio",
      icon: "./assets/icons/sewing.png",
    },
  ];

  // ================= LOAD ARTISANS FROM API =================
  async function loadRemoteArtisans() {
    try {
      const res = await fetch("/api/artisans");
      if (!res.ok) throw new Error("API error");

      const list = await res.json();

      return list
        .filter(a => a.lat && a.lng)
        .map(a => ({
          id: a.id,
          position: { lat: Number(a.lat), lng: Number(a.lng) },
          title: a.title || "Artisan",
          icon: a.icon || `./assets/icons/${a.craft || "pottery"}.png`,
        }));
    } catch (e) {
      console.warn("Using fallback artisans", e);
      return fallbackArtisans;
    }
  }

  // ================= CREATE MARKERS =================
  loadRemoteArtisans().then(list => {
    list.forEach(artisan => {
      const marker = new google.maps.Marker({
        position: artisan.position,
        map,
        title: artisan.title,
        icon: {
          url: artisan.icon,
          scaledSize: artisan.icon.includes("sewing")
            ? new google.maps.Size(36, 36)
            : artisan.icon.includes("costumes")
            ? new google.maps.Size(44, 44)
            : new google.maps.Size(42, 42),
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="font-family:Inter;font-size:14px;min-width:180px;">
            <strong>${artisan.title}</strong><br>
            ${
              artisan.id
                ? `<a href="artisan.html?id=${artisan.id}"
                     style="display:inline-block;margin-top:6px;color:#556B2F;font-weight:500;text-decoration:none;">
                     View profile →
                   </a>`
                : `<span style="color:#888;font-size:12px;">Profile unavailable</span>`
            }
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
    });
  });
}

// ================= LOAD GOOGLE MAPS =================
const script = document.createElement("script");
script.src =
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyCRL61vFE0NYxdJ7h3CSh7AeTqLkfYU_bY&callback=initMap";
script.async = true;
document.head.appendChild(script);
