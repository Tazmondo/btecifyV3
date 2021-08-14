import {pageEntry, pageExit, durationSecondsToMinutes} from "../util.js";
import {RouteController, ObjectController, ClipboardController, EventController} from "../controller.js";

function init(posAfter=true) {
    const {back} = RouteController
    const {subscribe, unSubscribe} = EventController
    const {makeSong} = ObjectController
    const {getClipboardData} = ClipboardController

    let newSong;

    let page = document.querySelector('#new-song-template').content.firstElementChild.cloneNode(true)
    let main = document.querySelector('main');

    if (posAfter) {
        main.insertAdjacentElement('beforeend', page)
    } else {
        main.insertBefore(page, Array.from(main.children).find(v => v.id.includes('-view')))
    }

    function drawPage(data) {
        let url = page.querySelector('#new-song-url')
        let title = page.querySelector('#new-song-title')
        let album = page.querySelector('#new-song-album')
        let artist = page.querySelector('#new-song-artist')
        let thumbnail = page.querySelector('#new-song-thumbnail')
        let duration = page.querySelector('#new-song-duration')

        let thumbImg = page.querySelector('img')

        let button = page.querySelector('button')

        thumbnail.addEventListener('change', e=>{
            if (e.target === thumbnail) {
                thumbImg.src = thumbnail.value
            }
        })

        if (data) {
            url.value = data.webpage_url
            title.value = data.track || data.title || "Error! No title found???"
            album.value = data.album || ""
            artist.value = data.artist || data.creator || data.uploader || ""
            thumbnail.value = data.thumbnail || ""
            thumbImg.src = thumbnail.value
            duration.value = durationSecondsToMinutes(data.duration)
        }

        let playlistListElement = page.querySelector('.playlist-list-select')

    }

    drawPage(getClipboardData())
    subscribe('clipboard', drawPage)

    pageEntry(page)

    page.querySelector('.view-back').addEventListener('click', e=>{
        back()
    }, {once: true})

    return function unInitPage() {
        pageExit(page, true)
        unSubscribe('clipboard', drawPage)
    }
}

export default init