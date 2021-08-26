import '../styles/index.scss';
import "jquery.mb.ytplayer";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Modal, bootstrap } from 'bootstrap';

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

// alert_markup
function alert_markup(alert_type, msg) {
  return '<div class="alert alert-' + alert_type + '" role="alert">' + msg + '</div>';
}

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}

$(document).ready(function () {

  // Video background
  $('.player').YTPlayer();

  // Map
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

  // RSVP

  const myModal = new Modal($('#rsvp-modal'), {
    keyboard: true,
  });

  $('#rsvp-form').on('submit', async function (e) {
    e.preventDefault();
    var data = $(this).serialize();
    $('#alert-wrapper').html(alert_markup('info',
      '<strong>Just a sec!</strong> We are saving your details.'));

    const buf = new TextEncoder('utf-8').encode($('#invite_code').val());
    const hash_buffer = await window.crypto.subtle.digest('SHA-256', buf);
    const hash = buf2hex(hash_buffer);
    if (hash !== '810e0513f2170990ddc1693d677b0fcc77b61456093b51d69e6a0209606404bc') {
      $('#alert-wrapper').html(alert_markup('danger',
        '<strong>Sorry!</strong> Your invite code is incorrect.'));
    } else {
      $.post('https://script.google.com/macros/s/AKfycbzFouecG2X4STE4PTd1U5G1ah814GDOD7_scFaoCH2TekAQi83Hi3M26YOXg5GjM__w3Q/exec', data)
        .done(function (data) {
          if (data.result === "error") {
            $('#alert-wrapper').html(alert_markup('danger', data.message));
          } else {
            $('#alert-wrapper').html('');
            myModal.show();
          }
        })
        .fail(function (data) {
          console.log(data);
          $('#alert-wrapper').html(alert_markup('danger',
            '<strong>Sorry!</strong> There is some issue with the server. '));
        });
    }
  });
});