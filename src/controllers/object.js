import {Playlist} from "./objects/playlist.js";
import {Song} from './objects/song.js'
import {copyArray, randomIndex} from "../util.js";
import {ObjectController} from "../controller.js";

function initController(dispatch, save) {
    function updatedSongCallback(redraw) {
        if (redraw) {
            dispatch('song')
            dispatch('playlist')
        }
        save()
    }

    function updatedPlaylistCallback(redraw) {
        if (redraw) {
            dispatch('playlist')
        }
        save()
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
            try {
                return JSON.parse(localStorage['song'], parseObject)

            } catch (e) {
                console.log(e.message);
            }
        }
        console.log("Making new song array");
        return Playlist(updatedPlaylistCallback, "Songs")
    })()

    let playlistArray = (() => {
        if (localStorage['playlist'] !== undefined) {
            try {
                return JSON.parse(localStorage['playlist'], parseObject)
            } catch (e) {
                console.log(e.message);
            }
        }
        console.log("Making new playlist array");
        return []
    })()

    function doesPlaylistExist(playlist) {
        let titleArray = playlistArray.map(v => v.getTitle());
        return titleArray.includes(playlist.getTitle())
    }

    function getPlaylistIndex(playlist) {
        return playlistArray.findIndex(v => v === playlist)
    }

    function doesSongExist(song) {
        return false // todo: song name searching and stuff to check for potential duplicates
    }

    return {
        updatedSongCallback,
        updatedPlaylistCallback,

        /**
         * Creates a playlist.
         * @param playlistArgs {[]} [title, song[], thumbUrl]
         * @return {false | Playlist} Returns false if a playlist with that name already exists, or the new playlist.
         */
        makePlaylist(playlistArgs) {
            let newPlaylist = Playlist(updatedPlaylistCallback, ...playlistArgs)

            if (!doesPlaylistExist(newPlaylist)) {
                playlistArray.push(newPlaylist)
                dispatch('playlist')
                return newPlaylist
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

        renamePlaylist(playlist, newName) {
            if (!this.getPlaylistFromTitle(newName)) {
                playlist.setTitle(newName)
                dispatch('playlist')
            }
        },

        makeSong(songArgs, playlists=[]) {
            let newSong = Song(updatedSongCallback, ...songArgs)
            if (!doesSongExist(newSong)) {
                allSongPlaylist.addSong(newSong)
                playlists.forEach(playlist => {
                    playlist.addSong(newSong)
                })
                return newSong
            }
            return false
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

        getPlaylistsWithSong(song) {
            return playlistArray.filter(playlist => playlist.doesContainSong(song))
        },

        getAllSongs() {
            return allSongPlaylist
        },

        getRandomSong() {
            return allSongPlaylist.getSongs()[randomIndex(allSongPlaylist.getLength())]
        },

        setData(songPlaylist, iPlaylistArray) {
            allSongPlaylist = songPlaylist
            playlistArray = iPlaylistArray
        }
    }
}

export default initController