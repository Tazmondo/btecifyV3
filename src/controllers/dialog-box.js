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
 *     [type]: "input"|"confirm"
 * }}
 * @return {Promise<Array|boolean>} Returns an array of the user inputs, or false if they cancelled.
 */
async function generateInputDialog(title, mainText, options) {
    return new Promise((resolve, reject) => {
        title = title ?? ""
        mainText = mainText ?? ""

        let inputs = options?.inputs ?? []
        let type = options?.type ?? "input"

        let backDiv = document.getElementById('dialog-box-template')
            .content.firstElementChild.cloneNode(true)
        document.body.insertAdjacentElement('beforeend', backDiv)

        let foreDiv = backDiv.firstElementChild

        let titleElement = backDiv.querySelector('em')
        titleElement.textContent = title

        let mainTextElement = backDiv.querySelector('h3')
        mainTextElement.textContent = mainText

        let form = backDiv.querySelector('form')

        switch (type) {
            case "input":
                inputs.forEach((v, i) => {
                    let label = document.createElement('label')
                    label.textContent = v.label + ": "
                    form.insertAdjacentElement('afterbegin', label)

                    let newInput = document.createElement('input')
                    newInput.type = v.type
                    label.insertAdjacentElement('beforeend', newInput)


                    if (i === 0) newInput.focus()
                })
                break
            case "confirm":

                break

        }

        function submit() {
            let inputs = Array.from(form.elements)
                .filter(v => v.type !== 'submit');
            backDiv.remove()
            if (inputs.length > 0) {
                resolve(inputs.map(v => v.value))
            } else {
                resolve(true)
            }
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
        makeDraggable(titleElement, foreDiv)
    })

}

export {
    generateInputDialog
}