const m = require('mithril');

module.exports = {
    async oninit(vnode) {
        console.log('INIT Spotify');
    },
    view() { return m('div') }
}
