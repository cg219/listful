const m = require('mithril');
const config = require('./../config/config.json');
const MusicKit = require('./../libs/musickit');
const SpotifyList = require('./spotify/list');
const SpotifyAuth = require('./spotify/auth');

function sendToSpotify(event) {
    SpotifyAuth.authorize({
        client: config.spotify.client_id,
        redirect: config.spotify.redirect_uri,
        scope: 'playlist-read-private playlist-read-collaborative user-library-read'
    })
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
            isLoggedInSpotify() ? m(SpotifyList) : ''
        ])
    }
}
