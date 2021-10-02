import  * as EventController from '../controllers/event.js'
import * as util from '../impureUtil.js'
import {generateList} from '../components/song-list.js'

function init(args) {
    if (args === undefined || args[0] === undefined) {
        console.trace()
        throw new Error("Playlist view created without any given playlist.")
    }
    let playlist = args[0]

    let page = document.querySelector('#playlist-view-template').content.firstElementChild.cloneNode(true)

    let header = page.querySelector('h2')
    let songList = page.querySelector('.song-list')
    let drawSongList = generateList(songList, playlist)

    header.textContent = playlist.getTitle()

    function drawPage() {
        drawSongList()
    }

    drawPage()
    EventController.subscribe('playlist', drawPage)

    return [function() {
        EventController.unSubscribe('playlist', drawPage)
    }, page]
}

export default init