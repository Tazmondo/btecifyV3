import Playlist from "./objects/playlist.js";
import Song from './objects/song.js'
import {copyArray, randomIndex, extractId} from "../util.js";
import {dispatch} from "./event.js";
import {saveData, CURFLAG} from "../controller.js";

let flag = localStorage['flag'] || 0

let parsers = {
    'song': argArray => {
        if (flag < 1) {
            argArray[1] = extractId(argArray[1])
            argArray.splice(2, 0, 'youtube')
        }

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

let allSongPlaylist = (() => {
    if (localStorage['song'] !== undefined) {
        try {
            return JSON.parse(localStorage['song'], parseObject)

        } catch (e) {
            console.log(e.message);
        }
    }
    console.log("Making new song array");
    return Playlist("Songs")
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

Object.assign(window, {allSongPlaylist, playlistArray}) // For testing

function isPlaylistTitleUsed(title) {
    let titleArray = playlistArray.map(v => v.getTitle());
    return titleArray.includes(title)
}

function getPlaylistIndex(playlist) {
    return playlistArray.findIndex(v => v === playlist)
}

function getUsedRemoteUrls() {
    return allSongPlaylist.getSongs().reduce((map, song) => {
        map[song.getURL()] = song
        return map
    }, {})
}

function doesSongExist(song) {
    let remotes = getUsedRemoteUrls()
    return !!remotes[song.getURL()]
    // return false // todo: song name searching and stuff to check for potential duplicates
}

export function getSongFromUUID(uuid) {
    return allSongPlaylist.getSongs().find(v => v.getUUID() === uuid)
}

/**
 * Creates a playlist.
 * @param playlistArgs {[]} [title, song[], thumbUrl]
 * @return {false | Playlist} Returns false if a playlist with that name already exists, or the new playlist.
 */
export function makePlaylist(playlistArgs) {
    let newPlaylist = Playlist( ...playlistArgs)

    if (!isPlaylistTitleUsed(newPlaylist.getTitle())) {
        playlistArray.push(newPlaylist)
        dispatch('playlist')
        return newPlaylist
    }
    return false
}

export function addToPlaylist(playlist, song) {
    let result = playlist.addSong(song)
    dispatch('playlist')
    return result
}

export function removeFromPlaylist(playlist, song) {
    let result = playlist.removeSongWithSong(song)
    dispatch('playlist')
    return result
}

export function renamePlaylist(playlist, newName) {
    if (!getPlaylistFromTitle(newName)) {
        playlist.setTitle(newName)
        dispatch('playlist')
    }
}

/**
 * Deletes the given playlist.
 * @param playlist {Playlist}
 * @returns boolean
 */
export function deletePlaylist(playlist) {
    let index = getPlaylistIndex(playlist)
    if (index !== -1) {
        playlistArray.splice(index, 1)
        dispatch('playlist')
        return true
    }
    return false
}

/**
 * Register a song object with playlists.
 * @param song {Song}
 * @param playlists {[Playlist]}
 * @return boolean
 */
export function makeSong(song, playlists=[]) {
    if (!doesSongExist(song)) {
        allSongPlaylist.addSong(song)
        playlists.forEach(playlist => {
            playlist.addSong(song)
        })
        dispatch('song')
        return true
    }
    return false
}

export function deleteSong(song) {
    allSongPlaylist.removeSongWithSong(song)
    playlistArray.forEach(playlist => playlist.removeSongWithSong(song))
    dispatch('playlist')
    dispatch('song')
}

export function deleteUnusedSongs() {
    let usedUUIDS = playlistArray.reduce((map, playlist) => {
        playlist.getSongs().reduce((map2, song) => {
            map2[song.getUUID()] = true
            return map2
        }, map)
        return map
    }, {})
    allSongPlaylist.getSongs().forEach(v => {
        if (usedUUIDS[v.getUUID()] !== true) {
            allSongPlaylist.removeSongWithSong(v)
        }
    })
    // console.log(unusedSongs.map(v => v.getTitle()));
    dispatch('song')
    dispatch('playlist')
}

// Returns a sorted array of playlists.
export function getPlaylistArray() {
    return copyArray(playlistArray).sort((a, b) => {
        return b.getLength() - a.getLength()
    })
}

export function getPlaylistFromTitle(title) {
    return playlistArray.find(v => {return v.getTitle() === title})
}

export function getPlaylistsWithSong(song) {
    return playlistArray.filter(playlist => playlist.doesContainSong(song))
}

export function getSongPlaylist() {
    return allSongPlaylist
}

export function getRandomSong() {
    return allSongPlaylist.getSongs()[randomIndex(allSongPlaylist.getLength())]
}

export function setData(songPlaylist, iPlaylistArray) {
    allSongPlaylist = songPlaylist
    playlistArray = iPlaylistArray
}

function urlFromResponse(responseData) {
    switch (responseData.extractor) {
        case "youtube":
            return `youtube.com/watch?v=${responseData.id}`

        case "Bandcamp":
            return responseData.webpage_url
    }
}

export async function makeRemotePlaylist(playlistName, playlistURL) {
    if (!isPlaylistTitleUsed(playlistName)) {
        let remotePlaylist = await api.getShallowPlaylist(playlistURL)
        if (remotePlaylist?.entries) {
            let remotes = getUsedRemoteUrls()
            let duplicates = {}
            console.log(remotePlaylist, remotePlaylist.entries)
            let songs = Array.from(remotePlaylist.entries.map(v => {
                let newUrl = urlFromResponse(v)
                if (duplicates[newUrl] !== undefined) {
                    return false
                }
                if (remotes[newUrl] === undefined) {
                    let title = v.track || v.title
                    let newSong = Song(title, v.id, v.extractor, v.duration, v.uploader, v?.album, v?.thumbnail, undefined, undefined, newUrl)
                    allSongPlaylist.addSong(newSong)
                    remotes[newUrl] = newSong // Sometimes there are duplicate songs in the extracted playlist
                    duplicates[newUrl] = newSong
                    return newSong
                } else {
                    duplicates[newUrl] = remotes[newUrl]
                    return remotes[newUrl]
                }
            }).filter(v => v !== false))
            let newPlaylist = Playlist(playlistName, songs)
            playlistArray.push(newPlaylist)
            dispatch('playlist')
            return newPlaylist
        }
    }
}