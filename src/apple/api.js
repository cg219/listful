const m = require('mithril');
const MusicKit = require('./../../libs/musickit');
const { vow } = require('batboy.mente');
let _userToken;
let _developerToken;

var API = {
    setTokens({ userToken, developerToken }) {
        _userToken = userToken;
        _developerToken = developerToken;
    },
    playlist: {
        async create({ name, description, tracks, userToken, developerToken } = {}) {
            if ((!userToken && !_userToken) || (!developerToken && !_developerToken)) throw new Error('Please pass or set tokens');

            var [response, error] = await vow(m.request({
                url: 'https://api.music.apple.com/v1/me/library/playlists',
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${_developerToken}`,
                    'Music-User-Token': _userToken
                },
                body: {
                    attributes: {
                        name,
                        description
                    },
                    relationships: {
                        tracks: {
                            data: tracks
                        }
                    }
                }
            }));

            return response;
        }
    }
}

module.exports = API;
