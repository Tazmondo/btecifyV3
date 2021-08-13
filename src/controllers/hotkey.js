import {MusicController} from '../controller.js'

function init(dispatch) {
    // dispatch may not be needed as this object interfaces with other controllers, which all call dispatch themselves.

    const hotkeys = {
        Pause:  ['F13', pause, false],
        Skip: ['F14', skip, false],
        'Increase Volume': ['F18', increaseVolume, false],
        'Decrease Volume': ['F15', decreaseVolume, false]
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
        for (let hotkey in hotkeys) {
            hotkeys[hotkey][2] = api.registerHotkey(hotkeys[hotkey][0], hotkeys[hotkey][1])
        }
    }

    return {
        getHotKeys() {
            return hotkeys
        },

        setHotkey(hotkeyName, hotkeyString) {
            if (hotkeyName in hotkeys) {
                hotkeys[hotkeyName][0] = hotkeyString
                registerHotkeys()
                return hotkeys[hotkeyName][2]
            }
            throw new Error("Tried to set an invalid hotkey!")
        }
    }
}

export default init