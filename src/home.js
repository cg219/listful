const m = require('mithril');
const config = require('./../config/config.json');
const MusicKit = require('./../libs/musickit');
const SpotifyPlaylists = require('./spotifyList');

function sendToSpotify(event) {
    var client_id = encodeURIComponent(config.spotify.client_id);
    var redirect_uri = encodeURIComponent(config.spotify.redirect_uri);
    var scope = encodeURIComponent('playlist-read-private user-library-read');

    window.location = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=code`
}

async function sendToApple(event) {
    var mk = MusicKit.getInstance();
    var token = await mk.authorize();

    localStorage.setItem('apple_accessToken', token);
}

function isLoggedInSpotify() {
    return localStorage.getItem('spotify_accessToken') != null;
}

module.exports = {
    async oninit(vnode) {
        var response = await fetch('http://localhost:3000/apple/token', {
            method: 'POST'
        });

        var developerToken = (await response.json()).token;

        MusicKit.configure({
            developerToken,
            app: {
                name: 'Listful',
                build: '1.0.0'
            }
        });
    },
    view() {
        return m('div.home', [
            m('button', { onclick: sendToSpotify }, 'Sign in with Spotify'),
            m('button', { onclick: sendToApple }, 'Sign in with Apple'),
            isLoggedInSpotify() ? m(SpotifyPlaylists) : ''
        ])
    }
}
