import  * as EventController from '../controllers/event.js'
import {generateQueue} from "../components/song-list.js";

function initPage() {
    const {subscribe, unSubscribe} = EventController

    let observed = []

    let page = document.querySelector('#queue-view-template').content.firstElementChild.cloneNode(true)
    let main = document.querySelector('main');
    let songList = page.querySelector('.song-list')
    let playlist = generateQueue(songList)

    function drawPage() {
        playlist.draw()
    }

    drawPage()

    subscribe('playing', drawPage)
    return [function unInitPage() {
        unSubscribe('playing', drawPage)

    }, page]
}

export default initPage
