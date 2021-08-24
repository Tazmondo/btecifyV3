import {pageEntry, pageExit, durationSecondsToMinutes, durationMinutesToSeconds} from "../util.js";
import {RouteController, ObjectController, ClipboardController, EventController} from "../controller.js";

function init() {
    const {back} = RouteController
    const {subscribe, unSubscribe} = EventController
    const {makeSong, getPlaylistArray, getPlaylistFromTitle} = ObjectController
    const {getClipboardData} = ClipboardController

    let newSong;
    let selectedPlaylists = []
    let dragging = false;

    let page = document.querySelector('#new-song-template').content.firstElementChild.cloneNode(true)
    let main = document.querySelector('main');

    let url = page.querySelector('#new-song-url')
    let title = page.querySelector('#new-song-title')
    let album = page.querySelector('#new-song-album')
    let artist = page.querySelector('#new-song-artist')
    let thumbnail = page.querySelector('#new-song-thumbnail')
    let duration = page.querySelector('#new-song-duration')

    let playlistListElement = page.querySelector('.playlist-list-select')

    let thumbImg = page.querySelector('img')
    let createButton = page.querySelector('button')

    document.addEventListener('mousedown', (e) => dragging = true)
    document.addEventListener('mouseup', (e) => dragging = false)

    function toggleSelect(element) {
        element.classList.toggle('selected')
        updateSelectedPlaylists()
    }

    function generatePlaylistItem(playlist, selected) {
        let newElement = document.createElement('div')
        newElement.classList.toggle('playlist-list-item')
        newElement.textContent = playlist.getTitle()
        newElement.classList.toggle('selected', selected)

        newElement.addEventListener('mousedown', (e) => {
            if (e.target === newElement) toggleSelect(newElement)
        })

        newElement.addEventListener('mouseenter', (e) => {
            if (dragging && e.target === newElement) toggleSelect(newElement)
        })

        return newElement
    }

    function updateSelectedPlaylists() {
        selectedPlaylists = []
        Array.from(playlistListElement.children).forEach(playlistElement => {
            if (playlistElement.classList.contains('selected')) {
                let title = playlistElement.textContent
                selectedPlaylists.push(getPlaylistFromTitle(title))
            }
        })
    }

    function drawPage(data) {
        Array.from(playlistListElement.children).forEach(child => child.remove())

        thumbnail.addEventListener('change', e=>{
            if (e.target === thumbnail) {
                thumbImg.src = thumbnail.value
            }
        })

        url.value = ""
        title.value = ""
        album.value = ""
        artist.value = ""
        thumbnail.value = ""
        thumbImg.src = ""
        duration.value = ""

        if (data) {
            url.value = data.webpage_url
            title.value = data.track || data.title || "Error! No title found???"
            album.value = data.album || ""
            artist.value = data.artist || data.creator || data.uploader || ""
            thumbnail.value = data.thumbnail || ""
            thumbImg.src = thumbnail.value
            duration.value = durationSecondsToMinutes(data.duration)
        }


        getPlaylistArray().forEach(playlist => {
            playlistListElement.insertAdjacentElement('beforeend', generatePlaylistItem(playlist, selectedPlaylists.includes(playlist)))
        })
    }

    createButton.addEventListener('click', (e) => {
        if (e.target === createButton) {
            makeSong([
                title.value,
                url.value,
                durationMinutesToSeconds(duration.value),
                artist.value,
                album.value,
                thumbnail.value,
            ] ,selectedPlaylists)
            drawPage(undefined)
        }
    })

    drawPage(getClipboardData())
    subscribe('clipboard', drawPage)

    return [() => {
        unSubscribe('clipboard', drawPage)
    }, page]
}

export default init