const ytdl = require("youtube-dl-exec");

const extractionWrappers = {
    'youtube:tab': async (response) => {
        response.entries.forEach(v => v.extractor = "youtube")
        return response
    },
    'Bandcamp:album': async (response) => {
        response.entries = await Promise.all(response.entries.map(async (v) => {
            try{
                return await ytdl(v.url, {
                    dumpSingleJson: true,
                    noPlaylist: true
                });
            } catch (e) {
                console.log(e.message);
                return false
            }
        }))

        return response
    }
}

function existsInObject(object, key) {
    let val = object[key]
    return val !== undefined && val !== null && val !== ""
}

async function getShallowPlaylist(url) {
    try {
        let playlistData = await ytdl(url, {
            dumpSingleJson: true,
            yesPlaylist: true,
            flatPlaylist: true
        })
        if (playlistData.extractor in extractionWrappers) {
            return await extractionWrappers[playlistData.extractor](playlistData)
        } else {
            throw new Error(`Invalid extractor: ${playlistData.extractor}`)
        }
    } catch (e) {
        console.log("getShallowPlaylist() failed")
        console.log(e.message)
        return e
    }
}

module.exports = {
    getShallowPlaylist
}