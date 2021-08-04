console.log("controller.js running...")

import {Playlist, Song, parseObject} from "./objects.js";
import {copyArray} from "./util.js";

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

function makePlaylist(playlistArgs) {
    let newPlaylist = Playlist(...playlistArgs)

    if (!doesPlaylistExist(newPlaylist)) {
        playlistArray.push(newPlaylist)
        dispatch('playlist')
        return true
    }
    return false
}

function doesSongExist(song) {
    return false // todo: song name searching and stuff
}

function makeSong(songArgs, playlists=[]) {
    let newSong = Song(...songArgs)
    if (!doesSongExist(newSong)) {
        allSongPlaylist.addSong(newSong)
        playlists.forEach(playlist => {
            playlist.addSong(newSong)
        })
    }
}

let events = {
    'playlist': {
        callbacks: [ () => {
            localStorage['playlist'] = JSON.stringify(playlistArray)
        }],
        e: () => {return copyArray(playlistArray)}
    },
    'song': {
        callbacks: [ () => {
            localStorage['song'] = JSON.stringify(playlistArray)
        }],
        e: () => {return copyArray(allSongPlaylist)}
    }
}

function dispatch(eventName) {
    if (validEvent(eventName)) {
        throw "Tried to dispatch to an invalid event!"
    }

    events[eventName].callbacks.forEach(v => {
        v()
    })
    return true
}

function validEvent(event) {
    return events[event] === undefined
}

function unSubscribe(event, callback) {
    if (validEvent(event)) {
        throw "Tried to unsubscribe from an invalid event!"
    }

    let callbacks = events[event].callbacks;

    let index = callbacks.findIndex(v => {return v === callback})
    if (index > -1) {
        callbacks.splice(index, 1)
        return true
    }
    return false
}

function subscribe(event, callback) {
    if (validEvent(event)) {
        throw "Tried to subscribe to an invalid event!"
    }
    unSubscribe(event, callback)
    events[event].callbacks.push(callback)
    return true
}

function getPlaylistArray() {
    return copyArray(playlistArray)
}

function getPlaylistFromTitle(title) {
    return playlistArray.find(v => {return v.getTitle() === title})
}

// FOR DEBUGGING
// Object.assign(window, {dispatch, makePlaylist, doesPlaylistExist})
function readInputData() {
    let inputData = api.getInputData()
    let songs = []
    console.log(inputData)
    for (let playlist of inputData) {
        for (let song of playlist.songs) {
            if (!songs.find(v => {
                return v.getURL() === song.songurl
            })) {
                let duration = (Number(song.duration.substr(3, 2)) * 60) + Number(song.duration.substr(6, 2))
                if (isNaN(duration)) {throw "NaN duration"}
                let newSong = Song(song.songname, song.songurl, duration, song.author, "", song.thumbnail)
                songs.push(newSong)
            }
        }
    }
    console.log(songs)

    let playlists = []

    for (let playlist of inputData) {
        if (playlist.playlistname !== "empty"){

            let newPlaylist = Playlist(playlist.playlistname, songs.filter(v => {
                return playlist.songs.find(v2 => {
                    return v.getURL() === v2.songurl
                })
            }))
            playlists.push(newPlaylist)
        }
    }

    console.log(playlists)

    allSongPlaylist = songs;
    playlistArray = playlists;
    dispatch('playlist')
    dispatch('song')

}
//readInputData()

export {getPlaylistArray, getPlaylistFromTitle, subscribe, unSubscribe, makePlaylist}