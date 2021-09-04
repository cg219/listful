const m = require('mithril');

module.exports = {
    view() {
        return m('div.home', [
            m('button', { onclick: sendToSpotify }, 'Sign in with Spotify')
        ])
    }
}
