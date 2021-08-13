import {pageEntry, pageExit} from "../util.js";


function init() {
    let page = document.querySelector('#song-nav-page')

    function drawPage() {

    }

    drawPage()
    pageEntry(page)
    return function unInitPage() {

        pageExit(page)
    }
}

export default init