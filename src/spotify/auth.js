const m = require('mithril');

module.exports = {
    async getTokens({ refresh = 'spotify_refreshToken', access = 'spotify_accessToken' } = {}) {
        var params = new URLSearchParams(window.location.search);
        var response = await m.request({
            url: 'http://localhost:3000/spotify',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: { redirect: 'http://localhost:1234/spotify', code: params.get('code') }
        })

        return {
            accessToken: response.access_token,
            refreshToken: response.refresh_token
        }
    },
    async authorize({ client, redirect, scope }) {
        window.location = `https://accounts.spotify.com/authorize?client_id=${encodeURIComponent(client)}&redirect_uri=${encodeURIComponent(redirect)}&scope=${encodeURIComponent(scope)}&response_type=code`
    }
}
