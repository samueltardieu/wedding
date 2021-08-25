import '../styles/index.scss';
import 'bootstrap';
import jQuery from "jquery";
import "jquery.mb.ytplayer";

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}

console.log('webpack starterkit');

jQuery('.player').YTPlayer();