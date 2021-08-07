const fs = require("fs");
const path = require("path");
const axios = require("axios");

function db(dbPath) {
    const path = require('path')
    const fs = require('fs')
    const axios = require('axios')

    const thumbPath = path.join(dbPath, "./thumbnails")
    const musicPath = path.join(dbPath, "./music")

    console.log(thumbPath)
    console.log(musicPath);

    async function getFile(fileName, dir) {
        let fileNames = await fs.promises.readdir(dir)
        let filtered = fileNames.filter(v => {
            if (v.length >= 4) {
                if(v.substring(0, v.length-4) === fileName) { // Extract name up to the extension.
                    return path.join(dir, v)
                }
            }
            return ""
        })
        if (filtered.length > 1) {
            throw new Error("One file shouldn't have multiple extensions downloaded for now.")
        }
        if (filtered.length > 0) {
            return filtered[0]
        }
        return false
    }

    async function getThumb(uuid) {
        return await getFile(uuid, thumbPath)
    }

    async function downloadThumbnail(uuid, url) {
        try {
            let response = await axios({
                method: "get",
                url: url,
                responseType: 'stream'
            })
            console.log(`Downloaded ${url} for ${uuid}`)
            // pipe the result stream into a file on disc

            let ext = response.data.responseUrl.substr(response.data.responseUrl.length - 3, 3)
            let imageName = `${uuid}.${ext}`;
            let imagePath = path.resolve(thumbPath, imageName)
            response.data.pipe(fs.createWriteStream(imagePath))

            // return a promise and resolve when download finishes
            return new Promise((resolve, reject) => {
                response.data.on('end', () => {
                    resolve(imageName)
                })

                response.data.on('error', () => {
                    reject("Download failed.")
                })
            })
        } catch (err) {
            return false
        }
    }

    return {

        async fetchThumbnail (args) {
            let uuid = args[0]
            let url = args[1]
            let imageName = await getThumb(uuid) || await downloadThumbnail(uuid, url)

            if (imageName) {
                return `../db/thumbnails/${imageName}`
            }
            return false
        },

        async deleteUnusedThumbnails(uuidNoDelete) {

        },

        async songExists(uuid) { // todo: finish (check for music file extension)
            return await getFile(uuid, musicPath)
        }
    }
}

module.exports = db
