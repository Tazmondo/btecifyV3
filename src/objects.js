const placeholderURL = "./assets/thumbplaceholder.png"

function Song({title, url, author="", album="", thumbnail=""}={}) {
    let uuid = api.getUUID()

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
        }
    }
}

function validSong(song) {
    return Boolean(song?.getUUID && song?.getTitle && song?.getURL)
}

function Playlist({name, songs=[]}={}) {
    songs = songs.filter(validSong)

    return {
        getName() {
            return name
        },

        getSongs() {
            return songs
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
        }

    }
}

Object.assign(window, {Song, Playlist}) // For console testing and debugging todo: remove me

export { Song, Playlist }