const m = require('mithril');
const { setToken, playlist } = require('./api');

function makeList({ id, name, tracks }) {
    return m('li', { 'data-tracklist': tracks.href, 'data-id': id, onclick: onItemClick }, name)
}

async function onItemClick(event, vnode) {
    var data = await playlist.tracks({ url: event.target.attributes['data-tracklist'].value });

    console.log(data);
}

module.exports = {
    async oninit(vnode) {
        setToken(localStorage.getItem('spotify_accessToken'));
        await playlist.playlists();
    },
    view() {
        return m('div.List', [
            m('p', 'Spotify Playlists'),
            m('ul', playlist.data.map(makeList))
        ])
    }
}
