const m = require('mithril');
const Home = require('./home');
const SpotifyCallback = require('./spotify');

m.route.prefix = '';
m.route(document.querySelector('#app'), '/', {
    '/': Home,
    '/spotify': SpotifyCallback
});
