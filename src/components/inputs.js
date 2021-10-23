function createLabel(label, parent) {
    parent.insertAdjacentHTML('beforeend', `<label>${label}</label>`)
    return parent.lastElementChild
}

function createInput(type, parent) {
    parent.insertAdjacentHTML('beforeend', `<input type="${type}">`)
    return parent.lastElementChild
}

/**
 * Generates a checkbox given a label and a parent element.
 * @param label {string}
 * @param parentElement {HTMLElement|Node}
 * @param callBack {function(e)} A function to be called when the input changes
 * @param value {boolean} The starting value
 */
function CheckBox(label, parentElement, value, callBack) {
    let labelElement = createLabel(label, parentElement)
    labelElement.classList.toggle("checkbox", true)

    let inputElement = createInput("checkbox", labelElement)
    inputElement.checked = value

    labelElement.insertAdjacentHTML('beforeend', '<span></span>')

    inputElement.addEventListener('input', e => {
        callBack(e)
        e.stopPropagation()
    })
}

/**
 * Generates a text input
 * @param label {string} The label text
 * @param parentElement {HTMLElement|Node} The parent to add the input to
 * @param callBack {function(e)} Function to be called when input changes
 * @param value {string} Default value
 */
function Text(label, parentElement, callBack, value="") {
    let labelElement = createLabel(label, parentElement)
    let inputElement = createInput("text", labelElement)
    inputElement.value = value

    inputElement.addEventListener('input', e => {
        callBack(e)
        e.stopPropagation()
    })
}

export {CheckBox, Text}