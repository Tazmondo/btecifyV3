// todo: use requestanimationframe to group all dispatches together and execute all at once, saving massively on time

let events: {[eventName: string]: {callbacks: Function[], e: Function}} = {}

function invalidEvent(eventName: string) {
    return events[eventName] === undefined
}

function unSubscribe(eventName: string, callback: Function) {
    if (invalidEvent(eventName)) {
        return false
    }

    let callbacks = events[eventName].callbacks;

    let index = callbacks.findIndex(v => {return v === callback})
    if (index > -1) {
        callbacks.splice(index, 1)
        return true
    }
    return false
}

function setupEvent(name: string, callbacks: Function[], eventObjectCreator: Function) {
    events[name] = {
        callbacks: callbacks,
        e: eventObjectCreator
    }
}

function dispatch(eventName: string) {
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

Object.assign(window, {dispatch})  // For testing

function subscribe(eventName: string, callback: Function) {
    if (invalidEvent(eventName)) {
        return false
    }
    unSubscribe(eventName, callback)
    events[eventName].callbacks.push(callback)
    return true
}

export {setupEvent, dispatch, subscribe, unSubscribe}
