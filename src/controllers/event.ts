// todo: use requestanimationframe to group all dispatches together and execute all at once, saving massively on time
//  IMPLEMENTED BUT UNTESTED

type eventType = {
    callbacks: Function[],
    e: Function,
    willExecute: boolean
}

let events: { [eventName: string]: eventType } = {}

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
        e: eventObjectCreator,
        willExecute: false
    }
}

function dispatch(eventName: string) {
    if (invalidEvent(eventName)) {
        return false
    }

    events[eventName].willExecute = true
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

function frame() {
    for (let event of Object.values(events)) {
        if (event.willExecute) {
            event.willExecute = false
            event.callbacks.forEach(callback => {
                if (event.e) {
                    callback(event.e())
                } else {
                    callback()
                }
            })
        }
    }
    requestAnimationFrame(frame)
}

requestAnimationFrame(frame)

export {setupEvent, dispatch, subscribe, unSubscribe}
