import {copyArray, pageEntry, pageExit} from "../util.js";
import  * as EventController from '../controllers/event.js'
import  * as MusicController from '../controllers/music.js'
import  * as RouteController from '../controllers/route.js'
import * as util from '../impureUtil.js'

function initPage() {
    const {subscribe, unSubscribe} = EventController
    const {back} = RouteController
    const {getInfo} = MusicController
    const {generateSongElement} = util

    let observed = []

    let page = document.querySelector('#queue-view-template').content.firstElementChild.cloneNode(true)
    let main = document.querySelector('main');
    let songList = page.querySelector('.song-list')

    let scroll = true
    let scrollTimeout;

    function resetScrollTimeout(e) {
        if (scrollTimeout) clearTimeout(scrollTimeout)
        console.log("resetting");
        scroll = false
        scrollTimeout = setTimeout(() => {
            scroll = true
            drawPage(getInfo(), true)
        }, 15000)
    }

    songList.addEventListener('mousemove', resetScrollTimeout)
    // songList.addEventListener('scroll', resetScrollTimeout)

    function drawPage(info, forceScroll) {
        console.log("cL ", forceScroll, scroll)
        let queue = info.queue
        let history = info.history
        let currentSong = info.currentSong

        let currentArray = []
        if (currentSong) {
            currentArray = [currentSong]
        }

        let currentElement;

        function addSong(song, playing, past) {
            let insertedElement = generateSongElement(song, undefined, undefined, undefined, undefined, playing, past, observed);
            songList.insertAdjacentElement('beforeend', insertedElement)
            if (playing) {
                currentElement = insertedElement
            }
        }


        // When they are removed, the intersection observer detects it and they become unobserved.
        // So this code avoids this.
        let temp = copyArray(observed)
        let old = Array.from(songList.childNodes)
        observed = temp

        history.forEach(song => addSong(song, false, true))
        currentArray.forEach(song => addSong(song, true, false))
        queue.forEach(song => addSong(song, false, false))

        old.forEach(v => v.remove())

        if (currentElement && (forceScroll || scroll)) {
            setTimeout(() => {
                currentElement.scrollIntoView()
                songList.scrollBy(0, -songList.clientHeight/2)
            }, 50)
        }

    }

    drawPage(getInfo(), true)

    subscribe('playing', drawPage)
    return [function unInitPage() {
        unSubscribe('playing', drawPage)

    }, page]
}

export default initPage