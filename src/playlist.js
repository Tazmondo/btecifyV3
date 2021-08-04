import {getPlaylistArray, getPlaylistFromTitle, subscribe} from "./controller.js";

Array.from(document.querySelectorAll('.playlist-section')).forEach(v => {
    let selector = v.querySelector('.playlist-select')
    let dropdown = v.querySelector('.select-dropdown')

    dropdown.addEventListener('mouseenter', e => {
        selector.classList.toggle("hover", true)
    })

    dropdown.addEventListener('mouseleave', e => {
        selector.classList.toggle("hover", false)
    })
})


function generatePlaylistListElement(playlist, selected) {
    let title = playlist.getTitle()
    let newElement = document.createElement('div')

    newElement.classList.toggle("playlist-choice")
    if (selected) {
        newElement.classList.toggle('selected')
    }
    newElement.innerText = title

    return newElement
}

function generateSongElement(song) {
    let newSongItem = document.createElement('div')
    newSongItem.classList.toggle("song-list-item")

    let thumbTitleArtist = document.createElement('div')
    let thumb = document.createElement('img')
    thumb.loading = 'lazy'
    thumb.src = song.getThumb()

    let titleArtist = document.createElement('div')
    let title = document.createElement('p')
    let artist = document.createElement('p')

    newSongItem.appendChild(thumbTitleArtist)
    thumbTitleArtist.appendChild(thumb)
    thumbTitleArtist.appendChild(titleArtist)
    titleArtist.appendChild(title)
    titleArtist.appendChild(artist)

    let album = document.createElement('div')
    newSongItem.appendChild(album)

    let duration = document.createElement('div')
    newSongItem.appendChild(duration)

    return newSongItem
}

function playlistClickCallback(section, playlist) {
    section.dataset.selected = playlist.getTitle()
    drawPage()
}

function drawPage() {
    document.querySelectorAll('.select-dropdown *, .song-list *').forEach(v => {
        v.remove()
    })

    let playlists = getPlaylistArray()

    let playlistSections = document.querySelectorAll('.playlist-section')

    playlistSections.forEach((section) => {
        let dropdown = section.children[1]
        let selectedPlaylistTitle = section.dataset.selected;

        section.querySelector('.playlist-select > h3').innerText = selectedPlaylistTitle || "Select playlist..."

        playlists.forEach(playlist => {
            let newElement = generatePlaylistListElement(playlist, (selectedPlaylistTitle === playlist.getTitle()))

            newElement.addEventListener('click', e => {
                playlistClickCallback(section, playlist)
            })
            dropdown.insertAdjacentElement('beforeend', newElement)
        })

        if (selectedPlaylistTitle !== undefined) {
            let selectedPlaylist = getPlaylistFromTitle(selectedPlaylistTitle)
            let songList = section.querySelector('.song-list')

            selectedPlaylist.getSongs().forEach(song => {
                let newElement = generateSongElement(song)

                songList.insertAdjacentElement('beforeend', newElement)
            })
        }
    })
}

drawPage()
subscribe('playlist', drawPage)