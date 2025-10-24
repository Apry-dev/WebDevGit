function initMap() {
  const romania = { lat: 45.9432, lng: 24.9668 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 6.5,
    center: romania,
    styles: [
      { elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
      { featureType: "poi", stylers: [{ visibility: "off" }] },
      { featureType: "road", stylers: [{ color: "#f5f1e6" }] },
      { featureType: "water", stylers: [{ color: "#c9c9c9" }] }
    ]
  });

  const markers = [
    { position: { lat: 46.77, lng: 23.59 }, title: "Cluj Pottery Workshop" },
    { position: { lat: 44.43, lng: 26.10 }, title: "Bucharest Embroidery Studio" },
  ];

  markers.forEach(marker => {
    new google.maps.Marker({
      position: marker.position,
      map,
      title: marker.title,
      icon: "./assets/icons/pottery.png"
    });
  });
}

const script = document.createElement("script");
script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCRL61vFE0NYxdJ7h3CSh7AeTqLkfYU_bY&callback=initMap";
script.async = true;
document.head.appendChild(script);
