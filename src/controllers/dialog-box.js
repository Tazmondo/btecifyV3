import {makeDraggable} from "../util.js";

/**
 * Generates an input dialog box and fades out the rest of the screen.
 * @async
 * @param title {string}
 * @param mainText {string}
 * @param options {{
 *     [inputs]: [{
 *         type: "text",
 *         label: string
 *     }],
 *     [type]: "default"|"error"
 * }}
 * @return {Promise<Array|false>} Returns an array of the user inputs, or false if they cancelled.
 */
async function generateInputDialog(title, mainText, options) {
    return new Promise((resolve, reject) => {

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

        let form = backDiv.querySelector('form')
        inputs.forEach((v, i) => {
            let label = document.createElement('label')
            label.textContent = v.label + ": "
            form.insertAdjacentElement('afterbegin', label)

            let newInput = document.createElement('input')
            newInput.type = v.type
            label.insertAdjacentElement('beforeend', newInput)


            if (i === 0) newInput.focus()
        })

        makeDraggable(titleElement, foreDiv)

        function submit() {
            backDiv.remove()
            resolve(Array.from(form.elements)
                .filter(v => v.type !== 'submit')
                .map(v => v.value))
        }

        form.addEventListener('submit', e => {
            submit()
            e.preventDefault()
        })

        function cancel() {
            backDiv.remove()
            reject("User exited dialog.")
        }

        let closeButton = backDiv.querySelector('.dialog-box-close')

        closeButton.addEventListener('click', cancel)
        backDiv.addEventListener('mousedown', e => {
            if (e.target === backDiv){
                cancel()
            }
        })
    })

}

export {
    generateInputDialog
}