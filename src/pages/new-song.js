import {pageEntry, pageExit} from "../util.js";
import {RouteController, ObjectController} from "../controller.js";

function init(posAfter=true) {
    const {back} = RouteController
    const {makeSong} = ObjectController

    let newSong;

    let page = document.querySelector('#new-song-template').content.firstElementChild.cloneNode(true)
    let main = document.querySelector('main');

    if (posAfter) {
        main.insertAdjacentElement('beforeend', page)
    } else {
        main.insertBefore(page, Array.from(main.children).find(v => v.id.includes('-view')))
    }

    function drawPage() {

    }

    drawPage()
    pageEntry(page)

    page.querySelector('.view-back').addEventListener('click', e=>{
        back()
    }, {once: true})

    return function unInitPage() {
        pageExit(page, true)

        return newSong
    }
}

export default init