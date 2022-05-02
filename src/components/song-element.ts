import {copyArray, durationSecondsToMinutes} from "../util.js";
import {addToPlaylist, removeFromPlaylist} from "../controllers/object.js";
import {forceSetSong, removeFromQueue} from "../controllers/music.js";
import {highlightSearchedTerm} from "../controllers/search.js";
import {songBase} from "../controllers/types";
import {PlaylistInterface} from "../controllers/objects/playlist";
import * as api from '../controllers/api.js'

function SongElement(song: songBase,
                     searchQuery: string,
                     playlist?: PlaylistInterface,
                     superSub?: boolean,
                     otherPlaylist?: PlaylistInterface,
                     isRightSide?: boolean,
                     isPlayingSong?: boolean,
                     isHistorySong?: boolean,
                     iobservedArray?: number[],
                     isQueue?: boolean) {
    if (song === undefined) console.trace("undefined song on song element")
    let observedArray = iobservedArray ?? []
    let originalObserved = copyArray(observedArray)

    let newSongItemContainer = document.createElement('div')
    newSongItemContainer.classList.toggle("song-list-item-container")
    if (superSub) {
        newSongItemContainer.classList.toggle('super')
    }

    let template = document.querySelector('#song-list-item-template')! as HTMLTemplateElement

    if (observedArray.includes(song.id)) {
        newSongItemContainer.classList.toggle('seen', true)
        populateSongItem()
    }

    new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.target === newSongItemContainer) {
                if (entry.isIntersecting || originalObserved.includes(song)) {
                    if (!newSongItemContainer.classList.contains('seen')) {
                        newSongItemContainer.classList.toggle("seen")
                        populateSongItem()
                        observedArray.push(song.id)
                    }
                } else {
                    if (newSongItemContainer.classList.contains('seen')) {
                        depopulateSongItem()
                        newSongItemContainer.classList.toggle("seen")
                        observedArray.splice(observedArray.findIndex(v => v === song.id), 1)
                    }
                }
            }
        })
    }).observe(newSongItemContainer)

    function depopulateSongItem() {
        Array.from(newSongItemContainer.children).forEach(element => {  // Use Array.from since .children returns a live list
            element.remove()
        })
    }

    function populateSongItem() {
        let newSongItem = template.content.firstElementChild!.cloneNode(true) as HTMLElement
        newSongItem.dataset.uuid = song.id.toString()
        newSongItem.classList.toggle('enabled', !song.disabled)

        let thumb = newSongItem.querySelector('.thumb')! as HTMLElement
        let title = newSongItem.querySelector('.title')! as HTMLElement
        let artist = newSongItem.querySelector('.artist')! as HTMLElement
        let album = newSongItem.querySelector('.album')! as HTMLElement
        let duration = newSongItem.querySelector('.duration')! as HTMLElement

        let removeButton = newSongItem.querySelector('.playlist-page-remove-from-playlist')! as HTMLElement


        title.title = song.title
        duration.innerText = song.duration ? durationSecondsToMinutes(song.duration) : "00:00"

        highlightSearchedTerm(title, song.title, searchQuery)
        highlightSearchedTerm(artist, song.artist?.title ?? "", searchQuery)
        highlightSearchedTerm(album, song.album?.title ?? "", searchQuery)

        if (playlist) {
            removeButton.classList.toggle("inactive")
            removeButton.querySelector('title')!.textContent = `Remove from ${playlist.getTitle()}`

            // Stop playing song by accident when editing playlists (see again below)
            removeButton.addEventListener('click', e => {
                removeFromPlaylist(playlist, song)
                e.stopPropagation()
            })
            removeButton.addEventListener('dblclick', e => {
                e.stopPropagation()
            })
        }
        if (isHistorySong) {
            newSongItem.classList.toggle("sub")
        }

        if ((superSub || isPlayingSong) && otherPlaylist) {
            newSongItem.classList.toggle("super")
            if (superSub) {
                let addButtonEast = newSongItem.querySelector('.playlist-page-add-to-playlist-east')!
                let addButtonWest = newSongItem.querySelector('.playlist-page-add-to-playlist-west')!
                let addButton;

                if (isRightSide) {
                    addButtonWest.classList.toggle("inactive")
                    addButton = addButtonWest
                } else {
                    addButtonEast.classList.toggle("inactive")
                    addButton = addButtonEast
                }

                addButton.querySelector('title')!.textContent = `Add to ${otherPlaylist.getTitle()}`
                addButton.addEventListener('click', e => {
                    addToPlaylist(otherPlaylist, song)
                    e.stopPropagation() // So that spam adding does not cause songs to play.
                })
                // So that spam adding does not cause songs to play. (see again above)
                addButton.addEventListener('dblclick', e =>  e.stopPropagation())
            }
        }
        if (isQueue && !playlist) {
            removeButton.classList.toggle("inactive")
            removeButton.querySelector('title')!.textContent = `Remove from queue`

            // Stop playing song by accident when editing playlists (see again below)
            removeButton.addEventListener('click', e => {
                removeFromQueue(song)
                e.stopPropagation()
            })
            removeButton.addEventListener('dblclick', e => {
                e.stopPropagation()
            })
        }

        thumb.style.backgroundImage = `url(${api.getThumbUrl(song.id)})`

        if (!song.disabled) {
            newSongItem.addEventListener('dblclick', e => {
                console.log(`Request play ${song.title}`);
                forceSetSong(song)
            })
        }

        newSongItemContainer.insertAdjacentElement('afterbegin', newSongItem)
    }

    return newSongItemContainer
}

export default SongElement
