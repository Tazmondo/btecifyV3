import {options, updateOption} from '../controllers/options.js'
import {CheckBox, Hotkey, Seeker, Text} from "../components/inputs.js";
import {getHotKeys, setHotkey} from "../controllers/hotkey.js";

let page = document.getElementById('options-nav-page')
let container = page.querySelector('div.options-container')
let hotkeys = getHotKeys()

for (let optionsKey in options) {
    let option = options[optionsKey]
    switch (option.type) {
        case "checkbox":
            container.insertAdjacentElement('beforeend', CheckBox(option.name + ": ", option.value, (e) => {
                updateOption(optionsKey, e.target.checked)
            }))

            break
        case "text":
            container.insertAdjacentElement('beforeend', Text(option.name + ": ", e=> {
                updateOption(optionsKey, e.target.value)
            }, option.value))

            break

        case "seeker":
            container.insertAdjacentElement('beforeend', Seeker(option.name + ": ", value => {
                updateOption(optionsKey, value)
            }, option.round, option.min, option.max, option?.value))

            break
    }
}

for (let hotkeyName in hotkeys) {
    let hotkey = hotkeys[hotkeyName]
    let [newElement, validate] = Hotkey(hotkeyName+": ", value => {
        validate(setHotkey(hotkeyName, value))
    }, hotkey[0])
    validate(hotkey[2])
    container.insertAdjacentElement('beforeend', newElement)

}

function initPage() {


    return [() => {

    }, page]
}

export default initPage