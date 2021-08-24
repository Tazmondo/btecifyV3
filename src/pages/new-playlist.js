import {pageEntry, pageExit} from "../util.js";


function init(posAfter = true) {

    let page = document.querySelector('#new-playlist-template').content.firstElementChild.cloneNode(true)
    let main = document.querySelector('main');

    function drawPage() {

    }

    if (posAfter) {
        main.insertAdjacentElement('beforeend', page)
    } else {
        main.insertBefore(page, Array.from(main.children).find(v => v.id.includes('-view')))
    }

    drawPage()

    pageEntry(page)

    return [() => {
        pageExit(page, true)
    }, page]
}

export default init