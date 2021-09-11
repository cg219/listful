const m = require('mithril');

module.exports = {
    async oninit(vnode) {
        var response = await fetch('https://api.spotify.com/v1/me/playlists', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('spotify_accessToken')}`,
                'Content-Type': 'application/json'
            }
        })

        console.log(await response.json());
    },
    view() {
        return m('div.List', [
            m('p', 'Spotify Play List')
        ])
    }
}
