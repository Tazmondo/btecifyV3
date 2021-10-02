import  * as EventController from '../controllers/event.js'
import  * as ObjectController from '../controllers/object.js'
import  * as MusicController from '../controllers/music.js'
import * as util from '../impureUtil.js'

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
        let newScroll1 = document.querySelector('#playlist-section-1 .song-list')?.scrollTop
        let newScroll2 = document.querySelector('#playlist-section-2 .song-list')?.scrollTop
        if (newScroll1) {
            scroll[0] = newScroll1
        }
        if (newScroll2) {
            scroll[1] = newScroll2
        }

        page.querySelectorAll('.select-dropdown *, .song-list *').forEach(v => {
            v.remove()
        })

        let playlists = getPlaylistArray()

        let playlistSections = document.querySelectorAll('.playlist-section')
        let selectedPlaylists = Array.from(playlistSections).map((section, index) => {
            return getPlaylistFromTitle(selected[index])
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

            if (selectedPlaylist !== undefined) {
                let songList = section.querySelector('.song-list')

                let superSongs = []

                if (otherPlaylist !== undefined) {
                    superSongs = selectedPlaylist.getSuperSongs(otherPlaylist.getSongs())
                }

                let songs = selectedPlaylist.getSongs()

                songs.forEach(song => {
                    let superSong = false
                    if (isSongInSongArray(superSongs, song)) {
                        superSong = true
                    }
                    let newElement = generateSongElement(song, selectedPlaylist, superSong, otherPlaylist,
                        section.id==="playlist-section-2", undefined, undefined, observed)
                    if(superSong) {
                        let superItems = Array.from(section.querySelectorAll('.song-list-item-container.super'))
                        if (superItems.length > 0) {
                            superItems.pop().insertAdjacentElement('afterend', newElement)

                        } else {
                            songList.insertAdjacentElement('afterbegin', newElement)
                        }

                    } else {
                        songList.insertAdjacentElement('beforeend', newElement)
                    }

                })

                if (selected[index] === selectedPlaylistTitle) {
                    // let interval = setInterval(() => {
                    //     songList.scrollTop = scroll[index]
                    //     if (songList.scrollTop === scroll[index] || songList.scrollTop >= songList.scrollHeight - songList.clientHeight) {
                    //         console.log("scrolled", songList.scrollHeight, songList.clientHeight);
                    //         clearInterval(interval)
                    //     } else{
                    //         console.log(songList.scrollHeight, songList.clientHeight);
                    //     }
                    // }, 1)

                    setTimeout(() => {
                        songList.scrollTop = scroll[index]
                        }, 350)
                } else {
                    songList.scrollTop = 0
                }
            }
        })
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
