import {copyArray, durationSecondsToMinutes} from "../util.js";
import {addToPlaylist, removeFromPlaylist} from "../controllers/object.js";
import {forceSetSong, removeFromQueue} from "../controllers/music.js";
import {highlightSearchedTerm} from "../controllers/search.js";

function SongElement(song, searchQuery, playlist, superSub, otherPlaylist, isRightSide, isPlayingSong, isHistorySong, iobservedArray, isQueue) {
    if (song === undefined) console.trace("undefined song on song element")
    let observedArray = iobservedArray ?? []
    let originalObserved = copyArray(observedArray)

    let newSongItemContainer = document.createElement('div')
    newSongItemContainer.classList.toggle("song-list-item-container")
    if (superSub) {
        newSongItemContainer.classList.toggle('super')
    }

    let template = document.querySelector('#song-list-item-template')

    if (observedArray.includes(song)) {
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
                        observedArray.push(song)
                    }
                } else {
                    if (newSongItemContainer.classList.contains('seen')) {
                        depopulateSongItem()
                        newSongItemContainer.classList.toggle("seen")
                        observedArray.splice(observedArray.findIndex(v => v === song), 1)
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
        let newSongItem = template.content.firstElementChild.cloneNode(true)
        newSongItem.dataset.uuid = song.getUUID()
        newSongItem.classList.toggle('enabled', !song.isDisabled())

        let thumb = newSongItem.querySelector('.thumb')
        let title = newSongItem.querySelector('.title')
        let artist = newSongItem.querySelector('.artist')
        let album = newSongItem.querySelector('.album')
        let duration = newSongItem.querySelector('.duration')

        let removeButton = newSongItem.querySelector('.playlist-page-remove-from-playlist')


        title.title = song.getTitle()
        duration.innerText = durationSecondsToMinutes(song.getDurationSeconds())

        highlightSearchedTerm(title, song.getTitle(), searchQuery)
        highlightSearchedTerm(artist, song.getArtist(), searchQuery)
        highlightSearchedTerm(album, song.getAlbum(), searchQuery)

        if (playlist) {
            removeButton.classList.toggle("inactive")
            removeButton.querySelector('title').textContent = `Remove from ${playlist.getTitle()}`

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

        if (superSub || isPlayingSong) {
            newSongItem.classList.toggle("super")
            if (superSub) {
                let addButtonEast = newSongItem.querySelector('.playlist-page-add-to-playlist-east')
                let addButtonWest = newSongItem.querySelector('.playlist-page-add-to-playlist-west')
                let addButton;

                if (isRightSide) {
                    addButtonWest.classList.toggle("inactive")
                    addButton = addButtonWest
                } else {
                    addButtonEast.classList.toggle("inactive")
                    addButton = addButtonEast
                }

                addButton.querySelector('title').textContent = `Add to ${otherPlaylist.getTitle()}`
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
            removeButton.querySelector('title').textContent = `Remove from queue`

            // Stop playing song by accident when editing playlists (see again below)
            removeButton.addEventListener('click', e => {
                removeFromQueue(song)
                e.stopPropagation()
            })
            removeButton.addEventListener('dblclick', e => {
                e.stopPropagation()
            })
        }

        let cachedThumb = song.getCachedThumb()
        if (cachedThumb) {
            thumb.style.backgroundImage = `url(${cachedThumb})`
        } else {
            song.getThumb().then(res => {
                thumb.style.backgroundImage = `url(${res})`
            })
        }


        if (!song.isDisabled()) {
            newSongItem.addEventListener('dblclick', e => {
                console.log(`Request play ${song.getTitle()}`);
                forceSetSong(song)
            })
        }

        newSongItemContainer.insertAdjacentElement('afterbegin', newSongItem)
    }

    return newSongItemContainer
}

export default SongElement