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
        if (songPlaylist) {
            undrawPage()
            let songList = page.querySelector('.song-list')

            let songArray = songPlaylist.getSongs()

            songArray.forEach(song => songList.insertAdjacentElement('beforeend', generateSongElement(song)))

        }
    }

    drawPage(getAllSongs())
    subscribe('song', drawPage)

    return [function unInitPage() {
    }, page]
}

export default init