function db(dbPath) {
    const path = require('path')
    const fs = require('fs')

    const thumbPath = path.join(dbPath, "./thumbnails")
    const musicPath = path.join(dbPath, "./music")

    console.log(thumbPath)
    console.log(musicPath);

    async function fileExists(fileName, dir) {
        let fileNames = await fs.promises.readdir(dir)
        let filtered = fileNames.filter(v => {
            if (v.length >= 4) {
                if(v.substring(0, v.length-4) === fileName) { // Extract name up to the extension.
                    return path.join(dir, v)
                }
            }
            return ""
        })

        if (filtered.length > 1) {throw new Error("One file shouldn't have multiple extensions downloaded for now.")} // todo: change me if multiple file extensions are possible
        return filtered.length === 1
    }

    return {
        async songExists(uuid) { // todo: finish (check for music file extension)
            return await fileExists(uuid, musicPath)
        },

        async thumbExists(uuid) {
            return await fileExists(uuid, thumbPath)
        },

        async downloadThumbnail(uuid, url) {

        }
    }
}

module.exports = db

