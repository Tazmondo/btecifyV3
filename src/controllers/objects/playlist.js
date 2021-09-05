// todo: Song added dates
import {placeholderURL, copyArray, randomIndex, validSong} from "../../util.js";

export function Playlist(updatedCallback, title, songs=[], thumb="") {
    let cachedThumb; // So that when using random thumbnail, it is consistent.
    console.log(songs)
    songs = songs.filter(validSong)

    // Sorts song list in place by title.
    function sortSongs() {
        songs.sort((a, b) => {
            //console.log(a.getTitle(), b.getTitle(), a.getTitle() > b.getTitle())
            return a.getTitle().toLowerCase() > b.getTitle().toLowerCase() ? 1 : -1
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

        // Sets a new title. Must only be called from object controller so it can validate that no other playlists
        // with the title exist.
        setTitle(newTitle) {
            title = newTitle
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
                    updatedCallback(false)
                    return cachedThumb
                } else {
                    return placeholderURL
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