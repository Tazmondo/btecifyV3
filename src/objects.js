console.log("objects.js running")

import {copyArray, randomIndex} from "./util.js";

const placeholderURL = "./assets/thumbplaceholder.png"

function validSong(song) {
    return Boolean(song?.getUUID && song?.getTitle && song?.getURL)
}

function Song(title, urls, duration, artist = "", album = "", thumbnails = [], uuid = "") {
    if (urls.length === 0 || urls.length > 2) {
        throw new Error(`Number of song urls is ${urls.length}`)
    }
    if (thumbnails.length > 2) {
        throw new Error(`Number of thumbnails is ${urls.thumbnails}`)
    }

    uuid = uuid || api.getUUID()

    let localUrl = "";
    let remoteUrl = "";

    let localThumb = "";
    let remoteThumb = "";

    urls.forEach(url => {
        if (url.startsWith('http')) {
            remoteUrl = url
        } else { // todo: actually add a check for file music
            localUrl = url
        }
    })

    thumbnails.forEach(thumbnail => {
        if (thumbnail.startsWith('http')) {
            remoteThumb = thumbnail
        } else { // todo: actually add a check for file thumb

            localThumb = thumbnail
        }
    })

    return {
        // Returns string title
        getTitle() {
            return title
        },

        // Returns string artist
        getArtist() {
            return artist
        },
        // Returns string uuid
        getUUID() {
            return uuid
        },

        // Returns localurl or the remoteurl if local does not exist.
        getAlbum() {
            return album
        },

        // Returns a url to the thumbnail, downloading it locally if it doesn't exist, or falling back to the remote
        // url and lastly the placeholder url
        getURL() {
            return localUrl || remoteUrl;
        },

        // Returns length of song in seconds
        getDurationSeconds() {
            return duration
        },

        // Only returns local url if it exists. Used to avoid unnecessary
        async getThumb() {
            if (!localThumb && remoteThumb) {
                localThumb = await api.fetchThumbnail(uuid, remoteThumb) || ""
            }
            return localThumb || remoteThumb || placeholderURL
        },

        // Returns string album
        getCachedThumb() {
            return localThumb || false
        },

        // Used by JSON.stringify
        toJSON() {
            return ['song', title, [remoteUrl, localUrl], duration, artist, album, [remoteThumb, localThumb], uuid]
        }
    }
}

// todo: Song added dates
function Playlist(title, songs=[], thumb="") {
    let cachedThumb; // So that when using random thumbnail, it is consistent.

    songs = songs.filter(validSong)

    // Sorts song list in place by title.
    function sortSongs() {
        songs.sort((a, b) => {
            //console.log(a.getTitle(), b.getTitle(), a.getTitle() > b.getTitle())
            return a.getTitle() > b.getTitle() ? 1 : -1
        })
    }
    sortSongs()

    // Removes a song from a playlist using its uuid. Boolean indicating success returned.
    function removeSong(uuid) {
        let targetSongIndex = songs.findIndex(v => {
            return v.getUUID() === uuid
        })

        if (targetSongIndex > -1) {
            songs.splice(targetSongIndex, 1)
            return true
        } else {
            console.warn("Tried to remove from a playlist a song that it didn't contain.")
            return false
        }
    }

    return {
        // Returns string title.
        getTitle() {
            return title
        },

        // Returns a copy of the song array.
        getSongs() {
            return copyArray(songs)
        },

        // Returns integer number of songs in song playlist.
        getLength() {
            return songs.length
        },

        // Async, returns a thumbnail randomly chosen from songs in the playlist, and on subsequent calls, the one
        // returned from the first call.
        async getThumb() {
            return thumb || cachedThumb ||
                (
                    songs.length > 0 ?
                    // cachedThumb = ... will also return cached thumb so it can be used here
                    cachedThumb = await songs[randomIndex(songs.length)]?.getThumb() :
                    placeholderURL
                )
        },

        // Returns boolean indicating whether the playlist contains a certain song object.
        doesContainSong(songObject) {
            return songs.some(v => {
                return v.getUUID() === songObject.getUUID()
            })
        },

        // Add song object to songs. Return boolean indicating success.
        addSong(song) {
            if (validSong(song) && !this.doesContainSong(song)) {
                songs.push(song)
                sortSongs()
                return true
            }
            return false
        },

        // Attempts to remove a song from songs using a song Object. Returns a boolean indicating success.
        // Throws an error if an invalid song Object is passed.
        removeSongWithSong(song) {
            if (validSong(song)) {
                let uuid = song.getUUID()
                if (api.uuidIsValid(uuid)) {
                    let result = removeSong(uuid);
                    sortSongs()
                    return result
                }
            }
            throw `This should never be reached. removeSong called on an invalid song: ${song}`
            return false
        },

        // Attempts to remove a song using a uuid. Returns a boolean indicating success.
        // Throws an error if given an invalid uuid.
        removeSongWithUuid(uuid) {
            if (api.uuidIsValid(uuid)) {
                let result = removeSong(uuid)
                sortSongs()
                return result
            }
            throw `This should never be reached. removeSong called with an invalid uuid: ${uuid}`
            return false
        },

        // For JSON.stringify
        toJSON() {
            return ['playlist', title, songs, thumb]
        }

    }
}

let parsers = {
    'song': argArray => {
        return Song(...argArray)
    },

    'playlist': argArray => {
        return Playlist(...argArray)
    }
}

function parseObject(k, v) {
    if (Array.isArray(v)) {
        let objName = v[0]
        if (parsers[objName] !== undefined) {
            return parsers[objName](v.slice(1))
        }
    }
    return v
}

//Object.assign(window, {Song, Playlist, parseObject}) // For console testing and debugging todo: remove me

export { Song, Playlist, parseObject }