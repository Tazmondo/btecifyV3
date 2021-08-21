import {pageEntry, pageExit} from "../util.js";
import {EventController, MusicController, RouteController, util} from "../controller.js";

function initPage(posAfter=true) {
    const {subscribe, unSubscribe} = EventController
    const {back} = RouteController
    const {getInfo} = MusicController
    const {generateSongElement} = util

    let page = document.querySelector('#queue-view-template').content.firstElementChild.cloneNode(true)
    let main = document.querySelector('main');

    if (posAfter) {
        main.insertAdjacentElement('beforeend', page)
    } else {
        main.insertBefore(page, Array.from(main.children).find(v => v.id.includes('-view')))
    }

    function drawPage(info, initial) {
        let queue = info.queue
        let history = info.history
        let currentSong = info.currentSong

        let currentArray = []
        if (currentSong) {
            currentArray = [currentSong]
        }

        let currentElement;

        let songList = page.querySelector('.song-list')

        Array.from(songList.childNodes).forEach(v => v.remove())

        function addSong(song, playing, past) {
            let insertedElement = generateSongElement(song, undefined, undefined, undefined, undefined, playing, past);
            songList.insertAdjacentElement('beforeend', insertedElement)
            if (playing) {
                currentElement = insertedElement
            }
        }

        history.forEach(song => addSong(song, false, true))
        currentArray.forEach(song => addSong(song, true, false))
        queue.forEach(song => addSong(song, false, false))

        if (currentElement && initial) {
            setTimeout(() => {
                currentElement.scrollIntoView()
                songList.scrollBy(0, -songList.clientHeight/2)
            }, 50)
        }

    }

    drawPage(getInfo(), true)
    pageEntry(page)

    page.querySelector('.view-back').addEventListener('click', e=>{
        back()
    }, {once: true})

    subscribe('playing', drawPage)
    return function unInitPage() {
        unSubscribe('playing', drawPage)
        pageExit(page, true)

    }
}

export default initPage