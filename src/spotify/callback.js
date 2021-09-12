const m = require('mithril');
const Auth = require('./auth');

module.exports = {
    async oninit(vnode) {
        console.log('INIT Spotify');

        var { accessToken, refreshToken } = await Auth.getTokens();

        localStorage.setItem('spotify_accessToken', accessToken);
        localStorage.setItem('spotify_refreshToken', refreshToken);

        window.location.href = '/';
    },
    view() { return m('div') }
}
