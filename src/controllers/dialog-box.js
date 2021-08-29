import {makeDraggable} from "../util.js";

/**
 * Generates an input dialog box and fades out the rest of the screen.
 * @param title {string}
 * @param mainText {string}
 * @param options {{
 *     [inputs]: ["text"],
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

    let titleHeader = document.createElement('h1')
    titleHeader.textContent = title
    foreDiv.insertAdjacentElement('beforeend', titleHeader)

    makeDraggable(titleHeader, foreDiv)

    backDiv.addEventListener('mousedown', e => {
        if (e.target === backDiv){
            backDiv.remove()
        }
    })
}

export {
    generateInputDialog
}