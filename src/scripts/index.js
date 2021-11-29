import '../styles/index.scss';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Modal, bootstrap } from 'bootstrap';

// stupid hack so that leaflet's images work after going through webpack
import marker from 'leaflet/dist/images/marker-icon.png';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Internationalisation
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import 'youtube-background';
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
  i18next.use(LanguageDetector).init({
    debug: true,
    fallbackLng: 'en',
    resources: {
      en: {
        translation: {
          "pageTitle": "Ali &#x1F492 Émeline",
          "hitched": "We are getting hitched",
          "dates": "It is happening on the 19<sup>th</sup> of July 2022 and we would love for you to be a part of it.",
          "getThere": "How do I get there?",
          "easier": "It's way easier than you think!",
          "manorName": "Manoir de la Fresnaye",
          "manorCity": "Réminiac, Brittany",
          "thanks": "Thank you!",
          "glad": "We are glad to see you join us on our big day.",
          "waiting": "What are you waiting for?",
          "appreciate": "We would greatly appreciate if you could RSVP before 1st of June 2022",
          "yourName": "Your name",
          "yourEmail": "Your email",
          "plusOne": "Husband/Wife or kids",
          "inviteCode": "Invite code",
          "itsMe": "Yes, that's me!",
        }
      },
      fr: {
        translation: {
          "pageTitle": "Ali &#x1F492 Émeline",
          "hitched": "Nous allons nous marier!",
          "dates": "La fête aura lieu le 19 Juillet 2022 et nous serions ravis de votre présence",
          "getThere": "Comment y aller?",
          "easier": "Rien de plus simple!",
          "manorName": "Manoir de la Fresnaye",
          "manorCity": "Réminiac, Bretagne",
          "thanks": "Merci!",
          "glad": "Nous sommes heureux de votre présence le jour J.",
          "waiting": "Qu'attendez-vous?",
          "appreciate": "Nous vous remercions de bien vouloir nous faire parvenir votre réponse avant le premier Juin 2022",
          "yourName": "Votre nom",
          "yourEmail": "Votre courriel",
          "plusOne": "Moitié/enfants",
          "inviteCode": "Code d'invitation",
          "itsMe": "Oui, c'est moi!",
        }
      },
      fa: {
        translation: {
          "logo": "public/logo-fa.svg",
          "pageTitle": "امیرحسن &#x1F492 املین",
          "hitched": "عروسی می‌کنیم!",
          "dates": "۲۸ تیر ۱۴۰۱ در فرانسه جشنی می‌گیریم، و از دیدنتان خوشحال می‌شویم",
          "getThere": "چطور به مکان برسیم؟",
          "easier": "بسیار ساده است!",
          "manorName": "Manoir de la Fresnaye",
          "manorCity": "Réminiac, Bretagne",
          "thanks": "سپاسگزاریم!",
          "glad": "از حضور شما خوشوقتیم.",
          "waiting": "منتظر چه هستید؟",
          "appreciate": "لطفا جواب دعوتنامه را تا اول خرداد ۱۴۰۱ به ما برسانید",
          "yourName": "نام",
          "yourEmail": "ایمیل",
          "plusOne": "همسر/فرزند",
          "inviteCode": "رمز",
          "itsMe": "می آییم",
          "dir": "rtl",
        }
      }
    }
  }).then(function (t) {
    document.getElementById('pageTitle').innerHTML = i18next.t('pageTitle');
    document.getElementById('logo').src = i18next.t('logo', 'public/logo.svg')
    document.getElementById('hitched').innerHTML = i18next.t('hitched');
    document.getElementById('dates').innerHTML = i18next.t('dates');
    document.getElementById('getThere').innerHTML = i18next.t('getThere');
    document.getElementById('easier').innerHTML = i18next.t('easier');
    document.getElementById('manorName').innerHTML = i18next.t('manorName');
    document.getElementById('manorCity').innerHTML = i18next.t('manorCity');
    document.getElementById('thanks').innerHTML = i18next.t('thanks');
    document.getElementById('glad').innerHTML = i18next.t('glad');
    document.getElementById('waiting').innerHTML = i18next.t('waiting');
    document.getElementById('appreciate').innerHTML = i18next.t('appreciate');
    document.getElementById('yourName').placeholder = i18next.t('yourName');
    document.getElementById('yourEmail').placeholder = i18next.t('yourEmail');
    document.getElementById('plusOne').placeholder = i18next.t('plusOne');
    document.getElementById('inviteCode').placeholder = i18next.t('inviteCode');
    document.getElementById('itsMe').innerHTML = i18next.t('itsMe');
    document.getElementById('body').dir = i18next.t('dir', 'ltr');
  });

  // Video
  jQuery('[data-youtube]').youtube_background();

  // Map
  var map = L.map('map-canvas', {
    zoomControl: true,
    scrollWheelZoom: false
  }).setView([47.8561764, -2.2697361], 8);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.marker([47.8561764, -2.2697361]).addTo(map)
    .bindPopup('Manoir de la Fresnaye')
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