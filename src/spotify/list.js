const m = require('mithril');
const { setToken, playlist } = require('./api');
const { setTokens, playlist: applePlaylist } = require('./../apple/api');
const MusicKit = require('./../../libs/musickit');
const { vow } = require('batboy.mente');

function makeList({ id, name, description, tracks }) {
    return m('li', {
        'data-tracklist': tracks.href,
        'data-id': id,
        'data-description': description,
        'data-name': name,
        onclick: onItemClick
    }, name)
}

async function onItemClick(event) {
    var name = event.target.attributes['data-name'].value;
    var description = event.target.attributes['data-description'].value;
    var tracklist = event.target.attributes['data-tracklist'].value;
    var data = await playlist.tracks({ url: tracklist });
    var tracks = await data.reduce(getTracks, []);

    await createPlaylist({ name, description, tracks });

    console.log(`${name} Transferred`);
}

async function getTracks(acc, { track: { external_ids: { isrc } } }) {
    acc = await acc;

    var mk = MusicKit.getInstance();
    var [data, error] = await vow(mk.api.songs({ filter: { isrc } }));

    if (data) acc.push({ id: data[0].id, type: data[0].type });

    return acc;
}

async function createPlaylist({ name, description, tracks }) {
    var mk = MusicKit.getInstance();

    setTokens({ userToken: mk.api.library.userToken, developerToken: mk.api.library.developerToken });
    await applePlaylist.create({ name, description, tracks });
}

module.exports = {
    async oninit(vnode) {
        setToken(localStorage.getItem('spotify_accessToken'));
        await playlist.playlists();

        console.log(playlist.data);
    },
    view() {
        return m('div.List', [
            m('p', 'Spotify Playlists'),
            m('ul', playlist.data.map(makeList))
        ])
    }
}
