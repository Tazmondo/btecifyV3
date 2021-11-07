const ytdl = require("youtube-dl-exec");

async function getShallowPlaylist(url) {
    try {
        return await ytdl(url, {
            dumpSingleJson: true,
            yesPlaylist: true,
            flatPlaylist: true
        })
    } catch (e) {
        console.log("getShallowPlaylist() failed")
        console.log(e.message)
        return e
    }
}

module.exports = {
    getShallowPlaylist
}