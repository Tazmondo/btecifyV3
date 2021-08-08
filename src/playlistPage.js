import {getPlaylistArray, getPlaylistFromTitle, subscribe} from "./controller.js";
import {durationSecondsToMinutes} from "./util.js";

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

function generateSongElement(song, songList, superSub="") {
    let template = document.querySelector('#song-list-item-template')
    let newSongItem = template.content.firstElementChild.cloneNode(true)
    let thumb = newSongItem.querySelector('.thumb')
    let title = newSongItem.querySelector('.title')
    let artist = newSongItem.querySelector('.artist')
    let album = newSongItem.querySelector('.album')
    let duration = newSongItem.querySelector('.duration')

    title.innerText = song.getTitle()
    title.title = song.getTitle()
    artist.innerText = song.getArtist()
    album.innerText = song.getAlbum()
    duration.innerText = durationSecondsToMinutes(song.getDurationSeconds())

    if (superSub) {newSongItem.classList.toggle(superSub)}

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
            songList.scrollTop = 0
            let superSongs = []
            let subSongs = []

            if (otherPlaylist !== undefined) {
                superSongs = selectedPlaylist.getSuperSongs(otherPlaylist.getSongs())
                subSongs = selectedPlaylist.getSubSongs(otherPlaylist.getSongs())
            }

            let songs = selectedPlaylist.getSongs()
            songs.push(...subSongs)

            // songs.sort((a, b) => {
            //     //console.log(a.getTitle(), b.getTitle(), a.getTitle() > b.getTitle())
            //     return a.getTitle() > b.getTitle() ? 1 : -1
            // })

            songs.forEach(song => {
                let superSub = ""
                if (isSongInSongArray(superSongs, song)) {
                    superSub = "super"
                } else if (isSongInSongArray(subSongs, song)) {
                    superSub = "sub"
                }
                let newElement = generateSongElement(song, songList, superSub)

                switch (superSub) {
                    case "":
                        songList.insertAdjacentElement('beforeend', newElement)
                        break
                    case "super": {
                        let superItems = Array.from(section.querySelectorAll('.song-list-item.super'))
                        if (superItems.length > 0) {
                            superItems.pop().insertAdjacentElement('afterend', newElement)
                            break
                        }
                        songList.insertAdjacentElement('afterbegin', newElement)
                        break
                    }
                    case "sub": {
                        let subItems = Array.from(section.querySelectorAll('.song-list-item.sub'))
                        let superItems = Array.from(section.querySelectorAll('.song-list-item.super'))
                        if (subItems.length > 0) {
                            subItems.pop().insertAdjacentElement('afterend', newElement)
                            break
                        }
                        if (superItems.length > 0) {
                            superItems.pop().insertAdjacentElement('afterend', newElement)
                            break
                        }
                        songList.insertAdjacentElement('afterbegin', newElement)
                        break
                    }
                }
            })
        }
    })
}

drawPage()
subscribe('playlist', drawPage)