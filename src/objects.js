import {copyArray} from "./util.js";

const placeholderURL = "./assets/thumbplaceholder.png"

function Song(title, url, author = "", album = "", thumbnail = "", uuid = "") {
    uuid = uuid || api.getUUID()

    return {
        getTitle() {
            return title
        },

        getAuthor() {
            return author
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
            return ['song', title, url, author, album, thumbnail, uuid]
        }
    }
}

function validSong(song) {
    return Boolean(song?.getUUID && song?.getTitle && song?.getURL)
}

function Playlist(name, songs=[], thumb=placeholderURL) {
    songs = songs.filter(validSong)

    return {
        getName() {
            return name
        },

        getSongs() {
            return copyArray(songs)
        },

        getLength() {
            return songs.length
        },

        getThumb() {
            return thumb
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
            return ['playlist', name, songs, thumb]
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