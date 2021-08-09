import {durationSecondsToMinutes} from "./util.js";

import { EventController, ObjectController, MusicController } from './controller.js'
function initPage() {

    const {subscribe} = EventController
    const {
        getPlaylistArray,
        getPlaylistFromTitle,
        removeFromPlaylist,
        addToPlaylist
    } = ObjectController
    const {setSong} = MusicController

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


    function generatePlaylistListElement(playlist, state) {
        let title = playlist.getTitle()
        let newElement = document.createElement('div')

        newElement.classList.toggle("playlist-choice")

        switch (state) {
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

    function generateSongElement(song, playlist, superSub, otherPlaylist, isRightSide) {
        let template = document.querySelector('#song-list-item-template')
        let newSongItem = template.content.firstElementChild.cloneNode(true)
        let thumb = newSongItem.querySelector('.thumb')
        let title = newSongItem.querySelector('.title')
        let artist = newSongItem.querySelector('.artist')
        let album = newSongItem.querySelector('.album')
        let duration = newSongItem.querySelector('.duration')

        let removeButton = newSongItem.querySelector('.playlist-page-remove-from-playlist')


        title.innerText = song.getTitle()
        title.title = song.getTitle()
        artist.innerText = song.getArtist()
        album.innerText = song.getAlbum()
        duration.innerText = durationSecondsToMinutes(song.getDurationSeconds())

        removeButton.querySelector('title').textContent = `Remove from ${playlist.getTitle()}`
        removeButton.addEventListener('click', e => {
            removeFromPlaylist(playlist, song)
        })

        if (superSub) {
            newSongItem.classList.toggle("super")

            let addButtonEast = newSongItem.querySelector('.playlist-page-add-to-playlist-east')
            let addButtonWest = newSongItem.querySelector('.playlist-page-add-to-playlist-west')
            let addButton;

            if (isRightSide) {
                addButtonWest.classList.toggle("hidden")
                addButton = addButtonWest
            } else {
                addButtonEast.classList.toggle("hidden")
                addButton = addButtonEast
            }

            addButton.querySelector('title').textContent = `Add to ${otherPlaylist.getTitle()}`
            addButton.addEventListener('click', e => {
                addToPlaylist(otherPlaylist, song)
            })
        }

        let cachedThumb = song.getCachedThumb()
        if (cachedThumb) {
            thumb.style.backgroundImage = `url(${cachedThumb})`
        } else{
            new IntersectionObserver((entries, observer) => {
                entries.forEach( entry => {
                    if (entry.isIntersecting && entry.target.classList.contains('song-list-item')) {
                        song.getThumb().then(res => {
                            thumb.style.backgroundImage = `url(${res})`
                        })
                        observer.disconnect()
                    }
                })
            }).observe(newSongItem)
        }

        newSongItem.addEventListener('dblclick', e => {
            console.log(`Request play ${song.getTitle()}`);
            setSong(song)
        })

        return newSongItem
    }

    function playlistClickCallback(section, playlist, selected=false) {
        if (selected) {
            section.dataset.selected = ""
        } else {
            section.dataset.selected = playlist.getTitle()
        }
        drawPage()
    }

    function isSongInSongArray (songArray, song) {
        return songArray.some(v => {return v.getUUID() === song.getUUID()})
    }

    function drawPage() {
        let prevScroll1 = document.querySelector('#playlist-section-1 .song-list')?.scrollTop
        let prevScroll2 = document.querySelector('#playlist-section-2 .song-list')?.scrollTop
        let prevSelected1 = document.querySelector('#playlist-section-1 .select-dropdown .selected')?.innerText
        let prevSelected2 = document.querySelector('#playlist-section-2 .select-dropdown .selected')?.innerText

        let prevScroll = [prevScroll1, prevScroll2]
        let prevSelected = [prevSelected1, prevSelected2]

        document.querySelectorAll('.select-dropdown *, .song-list *.song-list-item').forEach(v => {
            v.remove()
        })

        let playlists = getPlaylistArray()

        let playlistSections = document.querySelectorAll('.playlist-section')
        let selectedPlaylists = Array.from(playlistSections).map(section => {
            return getPlaylistFromTitle(section.dataset.selected)
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
                        playlistClickCallback(section, playlist)
                    })
                } else if (state === "selected") {
                    newElement.addEventListener('click', e => {
                        playlistClickCallback(section, playlist, true)
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
                        section.id==="playlist-section-2")

                    if(superSong) {
                        let superItems = Array.from(section.querySelectorAll('.song-list-item.super'))
                        if (superItems.length > 0) {
                            superItems.pop().insertAdjacentElement('afterend', newElement)

                        } else {
                            songList.insertAdjacentElement('afterbegin', newElement)
                        }

                    } else {
                        songList.insertAdjacentElement('beforeend', newElement)
                    }

                })

                if (prevSelected[index] === selectedPlaylist.getTitle()) {
                    songList.scrollTop = prevScroll[index]
                } else {
                    songList.scrollTop = 0
                }
            }
        })
    }

    drawPage()
    subscribe('playlist', drawPage)
}

export default initPage
