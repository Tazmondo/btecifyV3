import {pageEntry, pageExit} from "../util.js";
import {EventController, ObjectController, util} from "../controller.js";

function init() {
    const {subscribe} = EventController
    const {getAllSongs} = ObjectController
    const {generateSongElement} = util

    let page = document.querySelector('#song-nav-page')

    function undrawPage() {
        let songList = page.querySelector('.song-list')
        Array.from(songList.children).forEach(v => v.remove())

    }

    function drawPage(songPlaylist) {
        undrawPage()
        if (songPlaylist) {
            let songList = page.querySelector('.song-list')

            let songArray = songPlaylist.getSongs()

            songArray.forEach(song => songList.insertAdjacentElement('beforeend', generateSongElement(song)))

        }
    }

    drawPage(getAllSongs())
    subscribe('song', drawPage)

    pageEntry(page)
    return function unInitPage() {
        pageExit(page)
    }
}

export default init