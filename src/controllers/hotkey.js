import {MusicController} from '../controller.js'

function init() {
    const globalHotkeys = {
        Pause:  ['F13', pause, false],
        Skip: ['F14', skip, false],
        'Increase Volume': ['F18', increaseVolume, false],
        'Decrease Volume': ['F15', decreaseVolume, false]
    }

    const localHotkeys = { // obviously unfinished todo: finish local hotkeys
        Pause:  ['space', pause, false],
        Skip: ['right arrow', skip, false],
        'Increase Volume': ['up arrow', increaseVolume, false],
        'Decrease Volume': ['down arrow', decreaseVolume, false]
    }

    registerHotkeys()

    function pause() {
        MusicController.togglePlaying()
    }

    function skip() {
        MusicController.forward()
    }

    function increaseVolume() {
        MusicController.setVolume(MusicController.getInfo().volume + 0.04)
    }

    function decreaseVolume() {
        MusicController.setVolume(MusicController.getInfo().volume - 0.04)
    }

    function registerHotkeys() {
        api.unRegisterAllHotkeys()
        for (let hotkey in globalHotkeys) {
            globalHotkeys[hotkey][2] = api.registerHotkey(globalHotkeys[hotkey][0], globalHotkeys[hotkey][1])
        }
    }

    return {
        getHotKeys() {
            return globalHotkeys
        },

        setHotkey(hotkeyName, hotkeyString) {
            if (hotkeyName in globalHotkeys) {
                globalHotkeys[hotkeyName][0] = hotkeyString
                registerHotkeys()
                return globalHotkeys[hotkeyName][2]
            }
            throw new Error("Tried to set an invalid hotkey!")
        }
    }
}

export default init