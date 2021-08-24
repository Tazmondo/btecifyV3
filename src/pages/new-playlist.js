import {pageEntry, pageExit} from "../util.js";


function init() {

    let page = document.querySelector('#new-playlist-template').content.firstElementChild.cloneNode(true)
    let main = document.querySelector('main');

    function drawPage() {

    }

    drawPage()

    return [() => {
    }, page]
}

export default init