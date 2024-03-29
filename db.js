const fs = require("fs");
const path = require("path");
const axios = require("axios");
const ytdl = require('youtube-dl-exec');
const clipboardy = require('clipboardy')
const {getShallowPlaylist} = require("./extractor.js");

let test = (() => {
    ytdl("https://www.youtube.com/watch?v=oA1OkYxBIZo", {
        format: 'worstaudio',
        dumpSingleJson: true,
        noPlaylist: true,
        output: './db/music/%(id)s.%(ext)s',
        progress: false,
        quiet: true,
    }).then(res => {
        console.log("one")
        console.log(res)
    }).catch(e => {
        console.log(e.message)
    })
})

function db(dbPath) {
    const thumbPath = path.join(dbPath, "./thumbnails")
    const musicPath = path.join(dbPath, "./music")

    fs.promises.mkdir(thumbPath).then(res => {console.log("Made thumbnail path")}).catch(e => {console.log("Thumbnail path already exists")})
    fs.promises.mkdir(musicPath).then(res => {console.log("Made music path")}).catch(e => {console.log("Music path already exists")})

    console.log(thumbPath)
    console.log(musicPath);

    // file name+extension -> [file name, extension]
    function extractNameAndExt(fullFileName) {
        let splitName = fullFileName.split(".")
        if (splitName.length > 1) {
            return [splitName.slice(0, splitName.length-1).join("."), splitName[splitName.length-1]]
        } else {
            return [splitName[0], ""]
        }
    }

    // Takes a filename and a directory, and checks whether that file (not including extension) exists. If yes then
    // return full filename (With extension) else return false.
    async function getFile(fileName, dir) {
        let fileNames = await fs.promises.readdir(dir)
        let filtered = fileNames.filter(v => {
            if (extractNameAndExt(v)[0] === fileName) {
                return path.join(dir, v)
            }
            return false
        })
        if (filtered.length > 1) {
            throw new Error("One file shouldn't have multiple extensions downloaded for now.")
        }
        if (filtered.length > 0) {
            return filtered[0]
        }
        return false
    }

    // Calls getFile with the thumbnail path and the given uuid.
    async function getThumb(uuid) {
        let newPath = await getFile(uuid, thumbPath);
        if (newPath) return path.resolve(thumbPath, newPath)
        return false
    }

    // Calls getFile with the thumbnail path and the given uuid.
    async function getSong(uuid) {
        let newPath = await getFile(uuid, musicPath);
        if (newPath) return path.resolve(musicPath, newPath)
        return false
    }

    // Takes a uuid and url and downloads a thumbnail to the thumbnail path with the uuid as the name. Returns the name
    // of the created image, or false if the request fails, or "download failed." if the download fails.
    async function downloadThumbnail(uuid, url) {
        try {
            let response = await axios({
                method: "get",
                url: url,
                responseType: 'stream'
            })
            console.log(`Downloaded ${url} for ${uuid}`)

            let ext = response.data.responseUrl.substr(response.data.responseUrl.length - 3, 3)
            switch (ext) {
                case "jpeg":
                    ext = "jpg"
            }
            let imageName = `${uuid}.${ext}`;
            let imagePath = path.resolve(thumbPath, imageName)
            response.data.pipe(fs.createWriteStream(imagePath))

            // return a promise and resolve when download finishes
            return new Promise((resolve, reject) => {
                response.data.on('end', () => {
                    resolve(imagePath)
                })

                response.data.on('error', () => {
                    reject("Download failed.")
                })
            })
        } catch (err) {
            return false
        }
    }

    // Downloads a song from a url and returns its filename (or false if errors)
    async function downloadSong(uuid, url) {
        try {
            await ytdl(url, {
                format: 'worstaudio',
                noPlaylist: true,
                output: `./db/music/${uuid}.%(ext)s`,
                progress: false,
                quiet: true,
                "rm-cache-dir": true
            })
            console.log(`Downloaded ${url} for ${uuid}`)
            return await getSong(uuid)
        } catch (e) {
            console.log("downloadSong() failed")
            console.error(e.message)
            return e
        }
    }

    // Returns a url to a streaming link for the song. (Or false if it errors)
    async function getRemoteSongStream(url) {
        try {
            let res = await ytdl(url, {
                format: 'worstaudio[protocol!=http_dash_segments]', // Dash cannot be streamed.
                noPlaylist: true,
                progress: false,
                dumpSingleJson: true,
            })
            return res.url
        } catch (e) {
            console.log("getRemoteSongStream() failed")
            console.log(url)
            console.error(e.message)
            return e
        }
    }

    async function removeFilesNotMatching(whitelist, dir) {
        let fileNames = await fs.promises.readdir(dir)

        for (let fileName of fileNames) {
            if (!whitelist.includes(extractNameAndExt(fileName)[0])) {
                console.log(`Delete ${fileName}`)
                try {
                    await fs.promises.rm(path.join(dir, fileName))
                } catch (e) {
                    console.error(e.message);
                }
            }
        }
    }

    return {
        // Takes a uuid and returns a boolean as to whether a thumbnail is downloaded for that uuid.
        async thumbExists(args) {
            let uuid = args[0]

            return Boolean(await getThumb(uuid))
        },

        // Returns an existing thumbnail given the uuid and url or downloads it if it does not exist.
        async fetchThumbnail (args) {
            let uuid = args[0]
            let url = args[1]
            let imageName = await getThumb(uuid) || await downloadThumbnail(uuid, url)

            if (imageName) {
                return imageName.replaceAll('\\', '/')
            } else {
                let replacedUrl = url.replace("maxresdefault", "hqdefault");
                return replacedUrl
            }
        },

        async deleteUnusedThumbnails(args) {
            let uuidNoDelete = args[0]
            await removeFilesNotMatching(uuidNoDelete, thumbPath)
        },

        async deleteUnusedSongs(args) {
            let uuidNoDelete = args[0]
            await removeFilesNotMatching(uuidNoDelete, musicPath)

        },

        // Takes an array of used UUIDs. Deletes all other downloads.
        async removeUnusedDownloads(args) {
            this.deleteUnusedThumbnails(args)
            this.deleteUnusedSongs(args)
        },

        // Returns boolean as to whether a song has been downloaded
        async songExists(args) {
            let uuid = args[0]

            return Boolean(await getSong(uuid))
        },

        async getSongPath(args) {
            let uuid = args[0]

            let songPath = await getSong(uuid);
            if (songPath) {
                return songPath.replaceAll('\\', '/')
            }
            return false
        },

        // Returns a song's source stream, downloading it if possible.
        async fetchSong(args) {
            let uuid = args[0]
            let url = args[1]

            let songUrl = await getSong(uuid) || await downloadSong(uuid, url)
            if (songUrl) {
                return songUrl
            } else {
                return await getRemoteSongStream(url)
            }
        },

        async downloadSong(args) {
            return await downloadSong(args[0], args[1])
        },

        async getRemoteSongStream(args) {
            return await getRemoteSongStream(args[0])
        },

        async getClipboard() {
            try {
                return await clipboardy.read()
            } catch (e) {
                return undefined
            }
        },

        async getSongData(url) {
            try {
                return await  ytdl(url, {
                    format: 'worstaudio',
                    dumpSingleJson: true,
                    noPlaylist: true,
                    progress: false,
                    quiet: true,
                })
            } catch (e) {
                return undefined
            }
        },

        getShallowPlaylist
    }
}

module.exports = db

