import {makeDraggable} from "../util.js";

/**
 * Generates an input dialog box and fades out the rest of the screen.
 * @param title {string}
 * @param mainText {string}
 * @param options {{
 *     [inputs]: [{
 *         type: "text",
 *         label: string
 *     }],
 *     [type]: "default"|"error"
 * }}
 * @return {Array|false} Returns an array of the user inputs, or false if they cancelled.
 */
function generateInputDialog(title, mainText, options) {
    title = title ?? ""
    mainText = mainText ?? ""

    let inputs = options?.inputs ?? []
    let type = options?.type ?? "default"

    let backDiv = document.getElementById('dialog-box-template')
        .content.firstElementChild.cloneNode(true)
    document.body.insertAdjacentElement('beforeend', backDiv)

    let foreDiv = backDiv.firstElementChild

    let titleElement = backDiv.querySelector('em')
    titleElement.textContent = title

    let mainTextElement = backDiv.querySelector('h3')
    mainTextElement.textContent = mainText

    let inputDiv = backDiv.querySelector('.inputs')

    inputs.forEach(v => {
        let label = document.createElement('label')
        label.textContent = v.label + ": "
        inputDiv.insertAdjacentElement('beforeend', label)

        let newInput = document.createElement('input')
        newInput.type = v.type
        label.insertAdjacentElement('beforeend', newInput)
    })

    makeDraggable(titleElement, foreDiv)

    let closeButton = backDiv.querySelector('.dialog-box-close')

    closeButton.addEventListener('click', e => {
        backDiv.remove()
    })

    backDiv.addEventListener('mousedown', e => {
        if (e.target === backDiv){
            backDiv.remove()
        }
    })
}

export {
    generateInputDialog
}