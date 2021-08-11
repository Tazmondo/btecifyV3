import {pageEntry, pageExit} from "../util.js";
import {EventController, MusicController} from "../controller.js";

function initPage() {
    const {subscribe} = EventController
    let page = document.querySelector('#queue-view')

    function drawPage(info) {

    }

    pageEntry(page)

    subscribe('playing', drawPage)
    return function unInitPage() {

        pageExit(page)

    }
}

export default initPage