const fastify = require('fastify');
const { vow } = require('batboy.mente');
const axios = require('axios');
const config = require('./../config/config.json');
const PORT = process.env.PORT || 3000;
const spotifySchema = {
    body: {
        code: { type: 'string' }
    }
}

function main() {
    var app = fastify();

    app.post('/spotify', spotifySchema, getSpotifyTokens);
    app.post('/spotify/refresh', spotifySchema, refreshSpotifyTokens);
    app.options('*', preflightCheck);

    return app;
}

async function getSpotifyTokens(req, res) {
    var [success, error] = await vow(axios({
        url: 'https://accounts.spotify.com/api/token',
        method: 'POST',
        params: {
            grant_type: 'authorization_code',
            code: req.body.code,
            redirect_uri: config.spotify.redirect_uri
        },
        headers: {
            'Authorization': `Basic ${Buffer.from(`${config.spotify.client_id}:${config.spotify.client_secret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }))

    if (error) console.error(error);
    // if (success) console.log(success);

    res
        .headers({ 'Access-Control-Allow-Origin': req.headers.origin })
        .send(success.data);
}

async function refreshSpotifyTokens(req, res) {
    var [success, error] = await vow(axios({
        url: 'https://accounts.spotify.com/api/token',
        method: 'POST',
        params: {
            grant_type: 'refresh_token',
            refresh_token: req.body.code
        },
        headers: {
            'Authorization': `Basic ${Buffer.from(`${config.spotify.client_id}:${config.spotify.client_secret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }))

    if (error) console.error(error);
    // if (success) console.log(success);

    res
        .headers({ 'Access-Control-Allow-Origin': req.headers.origin })
        .send(success.data);
}

async function preflightCheck(req, res) {
    res.headers({
        'Access-Control-Allow-Origin': req.headers.origin,
        'Access-Control-Allow-Methods': 'POST, GET',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }).send(200);
}

async function start(app) {
    var [_, error] = await vow(app.listen(PORT));

    if (error) {
        app.log.error(error);
        return process.exit(1);
    }

    console.log(`Listening on port: ${PORT}`);
}

start(main());
