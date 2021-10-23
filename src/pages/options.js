import {options, updateOption} from '../controllers/options.js'
import {CheckBox} from "../components/inputs.js";

let page = document.getElementById('options-nav-page')
let container = page.querySelector('div.options-container')

for (let optionsKey in options) {
    let option = options[optionsKey]
    switch (option.type) {
        case "checkbox":
            CheckBox(option.name + ": ", container, option.value, (e) => {
                updateOption(optionsKey, e.target.checked)
            })

            break

    }
}

function initPage() {


    return [() => {

    }, page]
}

export default initPage