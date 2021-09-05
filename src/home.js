const m = require('mithril');

function sendToSpotify(event) {
    console.log('sendToSpotify');
}

module.exports = {
    view() {
        return m('div.home', [
            m('button', { onclick: sendToSpotify }, 'Sign in with Spotify')
        ])
    }
}
