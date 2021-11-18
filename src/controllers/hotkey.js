import * as MusicController from './music.js'

function saveHotkeys() {
    let saveTable = {}
    for (let hotkeyName in globalHotkeys) {
        saveTable[hotkeyName] = globalHotkeys[hotkeyName][0]
    }
    localStorage.setItem('hotkeys', JSON.stringify(saveTable))
}

let globalHotkeys = {
    Pause:  ['F13', pause, false],
    Skip: ['F14', skip, false],
    'Increase Volume': ['F18', increaseVolume, false],
    'Decrease Volume': ['F15', decreaseVolume, false]
}

if (localStorage.getItem('hotkeys') !== null) {
    let saveTable = JSON.parse(localStorage.getItem('hotkeys'))
    for (let hotkeyName in saveTable) {
        globalHotkeys[hotkeyName][0] = saveTable[hotkeyName]
    }
    // Registered lower down
}

let localHotkeys = { // obviously unfinished todo: finish local hotkeys
    Pause:  ['space', pause, false],
    Skip: ['right arrow', skip, false],
    'Increase Volume': ['up arrow', increaseVolume, false],
    'Decrease Volume': ['down arrow', decreaseVolume, false]
}

// Without this, it would try and tab to the input on the options page, completely breaking the UI.
// Alternative is to add tabindex -1 to every single input (kinda long?)
// document.addEventListener('keydown', e => {
//     if (e.key === 'Tab') {
//         e.preventDefault()
//     }
// })

// Found a new solution
// the window breaks because the scroll of the html element is set to 600
// so just set it to 0
document.addEventListener('focusin', e=>{
    requestAnimationFrame(() => {
        document.scrollingElement.scrollLeft = 0
    })
})

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
        if (globalHotkeys[hotkey][0] !== "") {
            globalHotkeys[hotkey][2] = api.registerHotkey(globalHotkeys[hotkey][0], globalHotkeys[hotkey][1])
        } else {
            globalHotkeys[hotkey][2] = false
        }
    }
}

registerHotkeys()

function getHotKeys() {
    return globalHotkeys
}

const jsToNativeMap = {
    'AudioVolumeUp': 'VolumeUp',
    'AudioVolumeMute': 'VolumeMute',
    'AudioVolumeDown': 'VolumeDown',
    'MediaTrackNext': 'MediaNextTrack',
    'MediaTrackPrevious': 'MediaPreviousTrack',
}

function setHotkey(hotkeyName, hotkeyString) {
    if (hotkeyName in globalHotkeys) {
        hotkeyString = jsToNativeMap[hotkeyString] || hotkeyString
        globalHotkeys[hotkeyName][0] = hotkeyString
        registerHotkeys()
        saveHotkeys()
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

export {subscribeToKeydown, getHotKeys, setHotkey}