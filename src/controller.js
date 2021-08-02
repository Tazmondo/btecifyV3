import { Song, Playlist } from "./objects.js";

let allSongs = Playlist({
    name: "All Songs"
})

let playlists = []
let events = {
    'playlist': []
}

function validEvent(event) {
    return events[event] === undefined
}

function unSubscribe(event, callback) {
    if (validEvent(event)) {
        throw "Tried to unsubscribe from an invalid event!"
    }

    let index = events[event].findIndex(v => {return v === callback})
    if (index > -1) {
        events[event].splice(index, 1)
        return true
    }
    return false
}

function subscribe(event, callback) {
    if (validEvent(event)) {
        throw "Tried to subscribe to an invalid event!"
    }
    unSubscribe(event, callback)
    events[event].push(callback)
    return true
}

function dispatch(eventName, eventObj) {
    if (validEvent(eventName)) {
        throw "Tried to dispatch to an invalid event!"
    }
    events[eventName].forEach(v => {v(eventObj)})
    return true
}
