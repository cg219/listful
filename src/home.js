const m = require('mithril');
const config = require('./../config/config.json');

function sendToSpotify(event) {
    var client_id = encodeURIComponent(config.spotify.client_id);
    var redirect_uri = encodeURIComponent(config.spotify.redirect_uri);
    var scope = encodeURIComponent('playlist-read-private user-library-read');

    window.location = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=code`
}

module.exports = {
    view() {
        return m('div.home', [
            m('button', { onclick: sendToSpotify }, 'Sign in with Spotify')
        ])
    }
}
