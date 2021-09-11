const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const fastify = require('fastify');
const { vow } = require('batboy.mente');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 3000;
const spotifySchema = {
    body: {
        code: { type: 'string' }
    }
}
const appleKeyPath = path.resolve(process.cwd(), path.join('private', 'appleKey.p8'));
const appleKey = fs.readFileSync(appleKeyPath).toString();

// post('http://localhost:3000/apple/token')

function main() {
    var app = fastify();

    app.post('/spotify', spotifySchema, getSpotifyTokens);
    app.post('/spotify/refresh', spotifySchema, refreshSpotifyTokens);
    app.post('/apple/token', sendAppleToken);
    app.options('*', preflightCheck);

    return app;
}

async function sendAppleToken(req, res) {
    var token = jwt.sign({}, appleKey, {
        algorithm: 'ES256',
        expiresIn: '180d',
        issuer: process.env.APPLE_TEAM_ID,
        header: {
            alg: 'ES256',
            kid: process.env.APPLE_KEY_ID
        }
    });

    res
        .headers({ 'Access-Control-Allow-Origin': req.headers.origin, 'Content-Type': 'application/json' })
        .send({ token })
}

async function getSpotifyTokens(req, res) {
    var [success, error] = await vow(axios({
        url: 'https://accounts.spotify.com/api/token',
        method: 'POST',
        params: {
            grant_type: 'authorization_code',
            code: req.body.code,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI
        },
        headers: {
            'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
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
            'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
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
