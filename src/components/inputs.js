/**
 * Generates a checkbox given a label and a parent element.
 * @param label {string}
 * @param parentElement {HTMLElement|Node}
 * @param callBack {function} A function to be called when the input changes
 * @param value {boolean} The starting value
 * @return {object} A checkbox object
 */
function CheckBox(label, parentElement, value, callBack) {
    parentElement.insertAdjacentHTML('beforeend', `<label>${label}</label>`)
    let labelElement = parentElement.lastElementChild
    labelElement.classList.toggle("checkbox", true)

    labelElement.insertAdjacentHTML('beforeend', `<input type="checkbox">`)
    let inputElement = labelElement.firstElementChild
    inputElement.checked = value

    labelElement.insertAdjacentHTML('beforeend', '<span></span>')

    inputElement.addEventListener('input', e => {
        callBack(e)
        e.stopPropagation()
    })
}

export {CheckBox}