function initController() {
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

    return {
        unSubscribe,
        setupEvent(name, callbacks, eventObjectCreator) {
            events[name] = {
                callbacks: callbacks,
                e: eventObjectCreator
            }
        },

        dispatch(eventName) {
            if (invalidEvent(eventName)) {
                return false
            }

            events[eventName].callbacks.forEach(v => {
                v(events[eventName].e())
            })
            return true
        },

        subscribe(event, callback) {
            if (invalidEvent(event)) {
                return false
            }
            unSubscribe(event, callback)
            events[event].callbacks.push(callback)
            return true
        },
    }
}

export default initController