const m = require('mithril');
const Home = require('./home');
const SpotifyCallback = require('./spotify/callback');

m.route.prefix = '';
m.route(document.querySelector('#app'), '/', {
    '/': Home,
    '/spotify': SpotifyCallback
});
