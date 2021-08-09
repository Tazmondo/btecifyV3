import {copyArray} from "./util.js";

let events = {}

function validEvent(event) {
    return events[event] === undefined
}

function setupEvent(name, callbacks, eventObjectCreator) {
    events[name] = {
        callbacks: callbacks,
        e: eventObjectCreator
    }
}

function dispatch(eventName) {
    if (validEvent(eventName)) {
        throw "Tried to dispatch to an invalid event!"
    }

    events[eventName].callbacks.forEach(v => {
        v(events[eventName].e())
    })
    return true
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

const exports = {
    setupEvent,
    dispatch,
    subscribe,
    unSubscribe
}

export default exports
