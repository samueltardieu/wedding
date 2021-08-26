import '../styles/index.scss';
import 'bootstrap';
import jQuery from "jquery";
import "jquery.mb.ytplayer";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// stupid hack so that leaflet's images work after going through webpack
import marker from 'leaflet/dist/images/marker-icon.png';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: marker2x,
    iconUrl: marker,
    shadowUrl: markerShadow
});

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}

jQuery(document).ready(function () {
  jQuery('.player').YTPlayer();

  var map = L.map('map-canvas', {
    zoomControl: true,
    scrollWheelZoom: false
  }).setView([47.8561764, -2.2697361], 8);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.marker([47.8561764, -2.2697361]).addTo(map)
    .bindPopup('Manoir de la Fresnay.')
    .openPopup();
});