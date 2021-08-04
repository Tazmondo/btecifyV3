console.log("objects.js running")

import {copyArray, randomIndex} from "./util.js";

const placeholderURL = "./assets/thumbplaceholder.png"

function validSong(song) {
    return Boolean(song?.getUUID && song?.getTitle && song?.getURL)
}

function Song(title, url, duration, artist = "", album = "", thumbnail = "", uuid = "") {
    uuid = uuid || api.getUUID()
    let localUrl;
    let internetUrl;

    if (url.startsWith('http')) {
        internetUrl = url
    } else { // todo: actually add a check for file music
        localUrl = url
    }

    return {
        getTitle() {
            return title
        },

        getArtist() {
            return artist
        },

        getAlbum() {
            return album
        },

        getURL() {
            return localUrl || internetUrl || url;
        },

        async getThumb() {
            //let downloadedThumb = await api.fetchThumbnail(uuid)
            return await api.fetchThumbnail(uuid) || thumbnail || placeholderURL
        },

        getUUID() {
            return uuid
        },

        getDurationSeconds() {
            return duration
        },

        toJSON() {
            return ['song', title, url, duration, artist, album, thumbnail, uuid]
        }
    }
}

// todo: Song added dates
function Playlist(title, songs=[], thumb="") {
    let cachedThumb; // So that when using random thumbnail, it is consistent.

    songs = songs.filter(validSong)

    function sortSongs() {
        songs.sort((a, b) => {
            //console.log(a.getTitle(), b.getTitle(), a.getTitle() > b.getTitle())
            return a.getTitle() > b.getTitle() ? 1 : -1
        })
    }
    sortSongs()

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
        getTitle() {
            return title
        },

        getSongs() {
            return copyArray(songs)
        },

        getLength() {
            return songs.length
        },

        async getThumb() {
            return thumb || cachedThumb ||
                (
                    songs.length > 0 ?
                    // cachedThumb = ... will also return cached thumb so it can be used here
                    cachedThumb = await songs[randomIndex(songs.length)]?.getThumb() :
                    placeholderURL
                )
        },

        doesContainSong(song) {
            return songs.some(v => {
                return v.getUUID() === song.getUUID()
            })
        },

        addSong(song) {
            if (validSong(song) && !this.doesContainSong(song)) {
                songs.push(song)
                sortSongs()
                return true
            }
            return false
        },

        removeSongWithSong(song) {
            if (validSong(song)) {
                let uuid = song.getUUID()
                if (api.uuidIsValid(uuid)) {
                    let result = removeSong(uuid);
                    sortSongs()
                    return result
                }
            }
            throw "This should never be reached. removeSong called on an invalid song."
            return false
        },

        removeSongWithUuid(uuid) {
            if (api.uuidIsValid(uuid)) {
                let result = removeSong(uuid)
                sortSongs()
                return result
            }
            throw "This should never be reached. removeSong called with an invalid uuid."
            return false
        },

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
        console.log("waw");
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