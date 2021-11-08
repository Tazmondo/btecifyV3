import  * as EventController from '../controllers/event.js'
import  * as ObjectController from '../controllers/object.js'
import {generateList, generatePlaylist} from "../components/song-list.js";
import {unSubscribe} from "../controllers/event.js";

function init() {
    const {subscribe} = EventController
    const {getSongPlaylist} = ObjectController

    let page = document.querySelector('#song-nav-page')
    let songList = page.querySelector('.song-list')
    let playlist = generatePlaylist(songList, getSongPlaylist())

    playlist.draw()

    subscribe('song', playlist.draw)

    return [function unInitPage() {
        unSubscribe('song', playlist.draw)
    }, page]
}

export default init