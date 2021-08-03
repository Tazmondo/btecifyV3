console.log("controller.js running...")

import {Playlist, Song, parseObject} from "./objects.js";
import {copyArray} from "./util.js";

let allSongPlaylist = (() => {
    if (localStorage['song'] !== undefined) {
        return JSON.parse(localStorage['song'], parseObject)
    }
    return Playlist({
        name: "All Songs"
    })
})()

let playlistArray = (() => {
    if (localStorage['playlist'] !== undefined) {
        return JSON.parse(localStorage['playlist'], parseObject)
    }
    return []
})()


function makePlaylist(playlistArgs) {
    let newPlaylist = Playlist(...playlistArgs)
    playlistArray.push(newPlaylist)
    dispatch('playlist')
}

let events = {
    'playlist': {
        callbacks: [ () => {
            localStorage['playlist'] = JSON.stringify(playlistArray)
        }],
        e: () => {return copyArray(playlistArray)}
    },
    'songs': {
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
    return copyArray(playlistArray)
}

// FOR DEBUGGING
Object.assign(window, {makePlaylist})

export {getPlaylistArray, subscribe, unSubscribe}