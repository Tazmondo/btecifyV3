import {copyArray, pageEntry, pageExit} from "../util.js";
import  * as EventController from '../controllers/event.js'
import  * as MusicController from '../controllers/music.js'
import  * as RouteController from '../controllers/route.js'
import * as util from '../impureUtil.js'
import {generateQueue} from "../components/song-list.js";
import {play} from "../controllers/music.js";

function initPage() {
    const {subscribe, unSubscribe} = EventController
    const {back} = RouteController
    const {getInfo} = MusicController
    const {generateSongElement} = util

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