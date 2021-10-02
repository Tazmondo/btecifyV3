import  * as EventController from '../controllers/event.js'
import * as util from '../impureUtil.js'

function init(args) {
    if (args === undefined || args[0] === undefined) {
        console.trace()
        throw new Error("Playlist view created without any given playlist.")
    }
    let playlist = args[0]

    let page = document.querySelector('#playlist-view-template').content.firstElementChild.cloneNode(true)

    let header = page.querySelector('h2')
    let songList = page.querySelector('.song-list')

    header.textContent = playlist.getTitle()

    function drawPage() {
        Array.from(songList.childNodes).forEach(node => node.remove())

        let songs = playlist.getSongs()
        songs.forEach(song => {
            let newElement = util.generateSongElement(song, playlist)
            songList.insertAdjacentElement('beforeend', newElement)
        })
    }

    drawPage()
    EventController.subscribe('playlist', drawPage)

    return [function() {
        EventController.unSubscribe('playlist', drawPage)
    }, page]
}

export default init