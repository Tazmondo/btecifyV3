console.log("objects.js running")

import {copyArray, randomIndex} from "./util.js";

const placeholderURL = "./assets/thumbplaceholder.png"

function validSong(song) {
    return Boolean(song?.getUUID && song?.getTitle && song?.getURL)
}

function Song(updatedCallback, title, urls, duration, artist = "", album = "", thumbnails = [], uuid = "", disabled=false) {
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
        if (url.startsWith('http://') || url.startsWith('https://') || url.includes("www.")) {
            remoteUrl = url
        } else { // todo: actually add a check for file music
            localUrl = url
        }
    })

    thumbnails.forEach(thumbnail => {
        if (thumbnail.startsWith('http://') || thumbnail.startsWith('https://') || thumbnail.includes("www.") ) {
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
        // Returns string album
        getAlbum() {
            return album
        },

        // Returns localurl or the remoteurl if local does not exist.
        getURL() {
            return localUrl || remoteUrl;
        },

        isDisabled() {
            return disabled
        },

        async getSource() {
            if (!localUrl && remoteUrl) {
                console.group(title)
                console.log(`Fetching `);
                let source = await api.fetchSong(uuid, remoteUrl) || ""
                console.log(`Fetched `)
                console.groupEnd()
                if (source.includes(uuid)) {
                    localUrl = source
                }
            }
            if (localUrl) {
                updatedCallback(false)
                return localUrl
            } else {
                disabled = true
                updatedCallback(true)
                throw new Error("Song has no available source. Will become disabled.")
            }
        },

        getVideoId() {
            return remoteUrl.substr(remoteUrl.length-11, 11)
        },

        // Returns length of song in seconds
        getDurationSeconds() {
            return duration
        },

        // Returns a url to the thumbnail, downloading it locally if it doesn't exist, or falling back to the remote
        // url and lastly the placeholder url
        async getThumb() {
            let result;
            if (!localThumb && remoteThumb) {
                result = await api.fetchThumbnail(uuid, remoteThumb) || ""
                if (result.includes('db/thumbnails')) {
                    localThumb = result
                    updatedCallback(false)
                }
            }
            return localThumb || result || placeholderURL
        },

        // Only returns local url if it exists. Used to avoid unnecessary async calls
        getCachedThumb() {
            return localThumb || false
        },

        // Used by JSON.stringify
        toJSON() {
            return ['song', title, [remoteUrl, localUrl], duration, artist, album, [remoteThumb, localThumb], uuid, disabled]
        }
    }
}

// todo: Song added dates
function Playlist(updatedCallback, title, songs=[], thumb="") {
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
            updatedCallback()
            return true
        } else {
            console.warn("Tried to remove from a playlist a song that it didn't contain.")
            return false
        }
    }

    // Returns array of songs that are not disabled.
    function getEnabledSongs() {
        return copyArray(songs).filter( v => !v.isDisabled())
    }

    return {
        getEnabledSongs,

        // Returns string title.
        getTitle() {
            return title
        },

        // Returns a copy of the song array.
        getSongs() {
            return copyArray(songs)
        },

        // Returns integer number of enabled songs in song playlist.
        getLength() {
            return getEnabledSongs().length
        },


        // Takes an array of songs, returning a random song that does not exist in the array.
        getRandomFilteredSong(filter=[]) {
            let possibleSongs = getEnabledSongs().filter(v => {
                return !filter.includes(v)
            })
            if (possibleSongs.length > 0) {
                return possibleSongs[randomIndex(possibleSongs.length)]
            }
            return false
        },

        // Async, returns a thumbnail randomly chosen from songs in the playlist, and on subsequent calls, the one
        // returned from the first call.
        async getThumb() {
            return thumb || cachedThumb || await (async () => {
                if (this.getLength() > 0) {
                    cachedThumb = await getEnabledSongs()[randomIndex(this.getLength())]?.getThumb() || placeholderURL
                    updatedCallback()
                    return cachedThumb
                }
            })()
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
                updatedCallback()
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
                    updatedCallback()
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
                updatedCallback()
                return result
            }
            throw `This should never be reached. removeSong called with an invalid uuid: ${uuid}`
            return false
        },

        // Take a song array and return all songs in the playlist that do not exist in the array.
        getSuperSongs(songArray) {
            return songs.filter(v => {return !songArray.some(v2 => {return v.getUUID() === v2.getUUID()})})
        },

        // Take a song array and return all songs in it that aren't in the playlist.
        getSubSongs(songArray) {
            return songArray.filter(v => {return !songs.some(v2 => {return v.getUUID() === v2.getUUID()})})
        },

        // For JSON.stringify
        toJSON() {
            return ['playlist', title, songs, thumb]
        }

    }
}

//Object.assign(window, {Song, Playlist, parseObject}) // For console testing and debugging todo: remove me

export { Song, Playlist }