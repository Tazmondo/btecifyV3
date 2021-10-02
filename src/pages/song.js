import  * as EventController from '../controllers/event.js'
import  * as ObjectController from '../controllers/object.js'
import * as util from '../impureUtil.js'
import {generateList} from "../components/song-list.js";

function init() {
    const {subscribe} = EventController
    const {getAllSongs} = ObjectController
    const {generateSongElement} = util

    let page = document.querySelector('#song-nav-page')
    let songList = page.querySelector('.song-list')
    let draw = generateList(songList, getAllSongs())

    draw()

    subscribe('song', draw)

    return [function unInitPage() {
    }, page]
}

export default init