import * as MusicController from './music.js'

let globalHotkeys = {
    Pause:  ['F13', pause, false],
    Skip: ['F14', skip, false],
    'Increase Volume': ['F18', increaseVolume, false],
    'Decrease Volume': ['F15', decreaseVolume, false]
}

let localHotkeys = { // obviously unfinished todo: finish local hotkeys
    Pause:  ['space', pause, false],
    Skip: ['right arrow', skip, false],
    'Increase Volume': ['up arrow', increaseVolume, false],
    'Decrease Volume': ['down arrow', decreaseVolume, false]
}

function pause() {
    MusicController.togglePlaying()
}

function skip() {
    MusicController.forward()
}

function increaseVolume() {
    MusicController.setVolume(MusicController.getInfo().volume + 0.02)
}

function decreaseVolume() {
    MusicController.setVolume(MusicController.getInfo().volume - 0.02)
}

function registerHotkeys() {
    api.unRegisterAllHotkeys()
    for (let hotkey in globalHotkeys) {
        globalHotkeys[hotkey][2] = api.registerHotkey(globalHotkeys[hotkey][0], globalHotkeys[hotkey][1])
    }
}

registerHotkeys()

function getHotKeys() {
    return globalHotkeys
}

function setHotkey(hotkeyName, hotkeyString) {
    if (hotkeyName in globalHotkeys) {
        globalHotkeys[hotkeyName][0] = hotkeyString
        registerHotkeys()
        return globalHotkeys[hotkeyName][2]
    }
    throw new Error("Tried to set an invalid hotkey!")
}

function subscribeToKeydown(callback) {
    let listener = (e) => {
        callback(e)
    }
    document.addEventListener('keydown', listener)
    return () => document.removeEventListener('keydown', listener)
}

export {subscribeToKeydown}