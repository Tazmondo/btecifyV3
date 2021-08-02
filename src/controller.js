console.log("a")

import {Playlist, Song} from "./objects.js";
import {copyArray} from "./util.js";

let allSongs = localStorage['songs'] || Playlist({
    name: "All Songs"
})
let playlists = localStorage['playlists'] || []


function makePlaylist(playlistArgs) {
    let newPlaylist = Playlist(...playlistArgs)
    playlists.push(newPlaylist)
    dispatch('playlist')
}

let events = {
    'playlist': {
        callbacks: [],
        e: () => {return copyArray(playlists)}
    },
    'songs': {
        callbacks: [],
        e: () => {return copyArray(allSongs)}
    }
}

function dispatch(eventName) {
    if (validEvent(eventName)) {
        throw "Tried to dispatch to an invalid event!"
    }
    events[eventName].callbacks.forEach(v => {v()})
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
    return copyArray(playlists)
}

// FOR DEBUGGING
Object.assign(window, {makePlaylist})

export {getPlaylistArray, subscribe, unSubscribe}