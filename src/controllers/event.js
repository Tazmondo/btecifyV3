// todo: use requestanimationframe to group all dispatches together and execute all at once, saving massively on time

let events = {}

function invalidEvent(event) {
    return events[event] === undefined
}

function unSubscribe(event, callback) {
    if (invalidEvent(event)) {
        return false
    }

    let callbacks = events[event].callbacks;

    let index = callbacks.findIndex(v => {return v === callback})
    if (index > -1) {
        callbacks.splice(index, 1)
        return true
    }
    return false
}

function setupEvent(name, callbacks, eventObjectCreator) {
    events[name] = {
        callbacks: callbacks,
        e: eventObjectCreator
    }
}

function dispatch(eventName) {
    if (invalidEvent(eventName)) {
        return false
    }

    events[eventName].callbacks.forEach(v => {
        if (events[eventName].e) {
            v(events[eventName].e())
        } else {
            v()
        }
    })
    return true
}

window.dispatch = dispatch // For testing

function subscribe(event, callback) {
    if (invalidEvent(event)) {
        return false
    }
    unSubscribe(event, callback)
    events[event].callbacks.push(callback)
    return true
}

export {setupEvent, dispatch, subscribe, unSubscribe}
