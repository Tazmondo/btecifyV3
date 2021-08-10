import {Playlist, Song} from "./objects.js";
import {copyArray} from "./util.js";

function initController(dispatch, save) {
    function updatedSongCallback(redraw) {
        if (redraw) {
            dispatch('song')
            dispatch('playlist')
        }
        save()
    }

    function updatedPlaylistCallback() {
        dispatch('playlist')
    }

    let parsers = {
        'song': argArray => {
            return Song(updatedSongCallback, ...argArray)
        },

        'playlist': argArray => {
            return Playlist(updatedPlaylistCallback, ...argArray)
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

    let allSongPlaylist = (() => {
        if (localStorage['song'] !== undefined) {
            return JSON.parse(localStorage['song'], parseObject)
        }
        return Playlist("Songs")
    })()

    let playlistArray = (() => {
        if (localStorage['playlist'] !== undefined) {
            return JSON.parse(localStorage['playlist'], parseObject)
        }
        return []
    })()

    function doesPlaylistExist(playlist) {
        return playlistArray.map(v => {v.getTitle()}).includes(playlist.getTitle())
    }

    function doesSongExist(song) {
        return false // todo: song name searching and stuff to check for potential duplicates
    }

    return {
        allSongPlaylist,

        playlistArray,

        makePlaylist(playlistArgs) {
            let newPlaylist = Playlist(...playlistArgs)

            if (!doesPlaylistExist(newPlaylist)) {
                playlistArray.push(newPlaylist)
                dispatch('playlist')
                return true
            }
            return false
        },

        addToPlaylist(playlist, song) {
            let result = playlist.addSong(song)
            dispatch('playlist')
            return result
        },

        removeFromPlaylist(playlist, song) {
            let result = playlist.removeSongWithSong(song)
            dispatch('playlist')
            return result
        },

        makeSong(songArgs, playlists=[]) {
            let newSong = Song(...songArgs)
            if (!doesSongExist(newSong)) {
                allSongPlaylist.addSong(newSong)
                playlists.forEach(playlist => {
                    playlist.addSong(newSong)
                })
            }
        },

        // Returns a sorted array of playlists.
        getPlaylistArray() {
            return copyArray(playlistArray).sort((a, b) => {
                return b.getLength() - a.getLength()
            })
        },

        getPlaylistFromTitle(title) {
            return playlistArray.find(v => {return v.getTitle() === title})
        },
    }
}

export default initController