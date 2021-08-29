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

    let backDiv = document.createElement('div')
    backDiv.classList.toggle('dialog-background')
    document.body.insertAdjacentElement('beforeend', backDiv)

    let foreDiv = document.createElement('div')
    foreDiv.classList.toggle('dialog-foreground')
    backDiv.insertAdjacentElement('beforeend', foreDiv)

    let titleElement = document.createElement('h1')
    titleElement.textContent = title
    foreDiv.insertAdjacentElement('beforeend', titleElement)

    let mainTextElement = document.createElement('h3')
    mainTextElement.textContent = mainText
    foreDiv.insertAdjacentElement('beforeend', mainTextElement)

    let inputDiv = document.createElement('div')
    inputDiv.classList.toggle('inputs')
    foreDiv.insertAdjacentElement('beforeend', inputDiv)

    inputs.forEach(v => {
        let label = document.createElement('label')
        label.textContent = v.label
        inputDiv.insertAdjacentElement('beforeend', label)

        let newInput = document.createElement('input')
        newInput.type = v.type
        label.insertAdjacentElement('beforeend', newInput)
    })

    makeDraggable(titleElement, foreDiv)

    backDiv.addEventListener('mousedown', e => {
        if (e.target === backDiv){
            backDiv.remove()
        }
    })
}

export {
    generateInputDialog
}