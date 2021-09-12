const m = require('mithril');
const { vow } = require('batboy.mente');
let accessToken;

async function loadPlaylists({ token, next, data = [] } = {}) {
    if (!token && !accessToken) throw new Error('Please pass or set token');
    var [response, error] = await vow(m.request({
        url: `${ next || 'https://api.spotify.com/v1/me/playlists' }`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${ token || accessToken }`,
            'Content-Type': 'application/json'
        }
    }))

    if (error) throw error;
    if (response.next) {
        return await loadPlaylists({
            token: token || accessToken,
            next: response.next,
            data: [...data, ...response.items]
        })
    }

    return [...data, ...response.items];
}

async function loadTracks({ token, next, url, data = [] } = {}) {
    if (!token && !accessToken) throw new Error('Please pass or set token');

    var [response, error] = await vow(m.request({
        url: next || url,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${ token || accessToken }`,
            'Content-Type': 'application/json'
        }
    }))

    if (error) throw error;
    if (response.next) {
        return await loadTracks({
            token: token || accessToken,
            next: response.next,
            data: [...data, ...response.items]
        })
    }

    return [...data, ...response.items];
}

var API = {
    setToken(token) { accessToken = token; },
    playlist: {
        data: [],
        trackData: [],
        async playlists({ token } = {}) {
            API.playlist.data = await loadPlaylists({ token });
            return API.playlist.data;
        },
        async tracks({ token, url } = {}) {
            API.playlist.trackData = await loadTracks({ url });
            return API.playlist.trackData;
        }
    }
}

module.exports = API;
