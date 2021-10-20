import  * as EventController from '../controllers/event.js'
import  * as ObjectController from '../controllers/object.js'
import  * as MusicController from '../controllers/music.js'
import * as util from '../impureUtil.js'
import {generateCompare} from "../components/song-list.js";

let scroll = [0, 0]
let selected = ["", ""]

function initPage(args) {
    if (args) {
        selected[0] = args[0] ?? selected[0]
        selected[1] = args[1] ?? selected[1]
    }

    const {subscribe, unSubscribe} = EventController
    const {
        getPlaylistArray,
        getPlaylistFromTitle,
        removeFromPlaylist,
        addToPlaylist
    } = ObjectController
    const {forceSetSong} = MusicController
    const {generateSongElement} = util

    let playlistSections = document.querySelectorAll('.playlist-section')
    let selectedPlaylists = Array.from(playlistSections).map((section, index) => {
        return getPlaylistFromTitle(selected[index])
    })
    let playlistObjects = Array.from(playlistSections).map((section, index) => {
        return generateCompare(section.querySelector('.song-list'), undefined, selectedPlaylists[index], selectedPlaylists[1-index], index === 1)
    })

    let observed = []

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


    function generatePlaylistListElement(playlist, selectedOrDisabled) {
        let title = playlist.getTitle()
        let newElement = document.createElement('div')

        newElement.classList.toggle("playlist-choice")

        switch (selectedOrDisabled) {
            case "selected":
                newElement.classList.toggle('selected')
                break

            case "disabled":
                newElement.classList.toggle('disabled')
                break
        }

        newElement.innerText = title

        return newElement
    }

    function playlistClickCallback(index, playlist, isSelected=false) {
        if (isSelected) {
            selected[index] = ""
        } else {
            selected[index] = playlist.getTitle()
        }
        drawPage()
    }

    function isSongInSongArray (songArray, song) {
        return songArray.some(v => {return v.getUUID() === song.getUUID()})
    }
    function drawPage() {
        if (playlistObjects[0].element.scrollTop === 0) {
            setTimeout(() => {
                playlistObjects[0].element.scrollTop = scroll[0]
                playlistObjects[1].element.scrollTop = scroll[1]
            }, 350)
        }

        page.querySelectorAll('.select-dropdown *').forEach(v => {
            v.remove()
        })

        let playlists = getPlaylistArray()

        let selectedPlaylists = Array.from(playlistSections).map((section, index) => {
            return getPlaylistFromTitle(selected[index])
        })
        playlistObjects.forEach((v,i) => {
            v.setPlaylist(selectedPlaylists[i])
            v.setOtherPlaylist(selectedPlaylists[1-i])
        })

        playlistSections.forEach((section, index) => {
            let dropdown = section.children[1]
            let selectedPlaylist = selectedPlaylists[index]
            let selectedPlaylistTitle = selectedPlaylist?.getTitle()

            let otherPlaylist = selectedPlaylists[1 - index] // Get the other element of the selectedPlaylist array

            section.querySelector('.playlist-select > h3').innerText = selectedPlaylistTitle ?? "Select playlist..."

            playlists.forEach(playlist => {
                let state = ""
                if (selectedPlaylistTitle === playlist.getTitle()) {
                    state = "selected"
                }
                if (playlist.getTitle() === otherPlaylist?.getTitle()) {
                    state = "disabled"
                }
                let newElement = generatePlaylistListElement(playlist, state)

                if (!state) {
                    newElement.addEventListener('click', e => {
                        playlistClickCallback(index, playlist)
                    })
                } else if (state === "selected") {
                    newElement.addEventListener('click', e => {
                        playlistClickCallback(index, playlist, true)
                    })
                }
                dropdown.insertAdjacentElement('beforeend', newElement)
            })
        })
        playlistObjects.forEach(v => v.draw())
    }

    let page = document.getElementById('playlist-nav-page')

    subscribe('playlist', drawPage)

    drawPage()
    return [function unInitPage() {
        scroll = [document.querySelector('#playlist-section-1 .song-list').scrollTop,
            document.querySelector('#playlist-section-2 .song-list').scrollTop]

        unSubscribe('playlist', drawPage)
    }, page]
}

export default initPage
