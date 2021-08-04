console.log("objects.js running")

import {copyArray} from "./util.js";

const placeholderURL = "./assets/thumbplaceholder.png"

function validSong(song) {
    return Boolean(song?.getUUID && song?.getTitle && song?.getURL)
}

function Song(title, url, artist = "", album = "", thumbnail = "", uuid = "") {
    uuid = uuid || api.getUUID()
    album = album || title

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
            return url
        },

        getThumb() {
            return thumbnail || placeholderURL
        },

        getUUID() {
            return uuid
        },

        toJSON() {
            return ['song', title, url, artist, album, thumbnail, uuid]
        }
    }
}

// todo: Song added dates
function Playlist(title, songs=[], thumb="") {
    songs = songs.filter(validSong)

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

        addSong(song) {
            if (validSong(song)) {
                songs.push(song)
                return true
            }
            return false
        },

        removeSong(uuidOrSong) {
            let uuid = uuidOrSong
            if (validSong(uuidOrSong)) {
                uuid = uuidOrSong.getUUID()
            }

            let targetSongIndex = songs.findIndex(v => {return v.getUUID() === uuid})

            if (targetSongIndex) {
                songs.splice(targetSongIndex, 1)
                return true
            }
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