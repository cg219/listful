const m = require('mithril');

module.exports = {
    async oninit(vnode) {
        console.log('INIT Spotify');

        var params = new URLSearchParams(window.location.search);

        var response = await fetch('http://localhost:3000/spotify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ redirect: 'http://localhost:1234/spotify', code: params.get('code') })
        })

        response = await response.json();

        localStorage.setItem('spotify_accessToken', response.access_token);
        if (response.refresh_token) localStorage.setItem('spotify_refreshToken', response.refresh_token);

        window.location.href = '/';
    },
    view() { return m('div') }
}
