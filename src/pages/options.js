import {options, updateOption} from '../controllers/options.js'
import {CheckBox, Seeker, Text} from "../components/inputs.js";

let page = document.getElementById('options-nav-page')
let container = page.querySelector('div.options-container')

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

function initPage() {


    return [() => {

    }, page]
}

export default initPage