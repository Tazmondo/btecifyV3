console.log("objects.js running")

import {copyArray} from "./util.js";

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

        getThumb() {
            return thumbnail || placeholderURL
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
    songs = songs.filter(validSong)

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

        getThumb() {
            return thumb || this.getSongs()[0]?.getThumb() || placeholderURL
        },

        doesContainSong(song) {
            return songs.some(v => {
                return v.getUUID() === song.getUUID()
            })
        },

        addSong(song) {
            if (validSong(song) && !this.doesContainSong(song)) {
                songs.push(song)
                return true
            }
            return false
        },

        removeSongWithSong(song) {
            if (validSong(song)) {
                let uuid = song.getUUID()
                if (api.uuidIsValid(uuid)) {
                    return removeSong(uuid);
                }
            }
            throw "This should never be reached. removeSong called on an invalid song."
            return false
        },

        removeSongWithUuid(uuid) {
            if (api.uuidIsValid(uuid)) {
                return removeSong(uuid)
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