
import {copyArray, durationSecondsToMinutes} from "../util.js";
import {addToPlaylist, removeFromPlaylist} from "../controllers/object.js";
import {forceSetSong} from "../controllers/music.js";

/**
 * Constructs a regular list of songs on an element.
 * @param element {HTMLElement|Node} Must have class song-list
 * @param playlist {Playlist|Song[]}
 * @returns function Draw function
 */
function generateList(element, playlist) {
    let observedArray = []

    function draw() {
        Array.from(element.children).forEach(v => v.remove())

        let songList = playlist?.getSongs() || playlist
        songList.forEach(song => {
            element.insertAdjacentElement('beforeend',
                generateSongElement(
                    song,
                    playlist?.getSongs !== undefined ? playlist : undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    observedArray
                )
            )

        })
    }

    return draw
}

/**
 * Construct a compared song-list given an element.
 *
 */
function generateCompare() {

    generateSongList()
}

/**
 * Construct a queue song list given an element.
 *
 */
function generateQueue() {

    generateSongList()
}

/**
 * Take an element and turn it into a songlist
 * @param element {HTMLElement|Node} Must have class song-list
 * @param songs {Song[]?}
 * @param playlist {Playlist?}
 * @param superSub {boolean?}
 * @param otherPlaylist {Playlist?}
 * @param isRightSide {boolean?}
 * @param isPlayingSong {boolean?}
 * @param isHistorySong {boolean?}
 * @return function Draw function
 */
function generateSongList(element, songs, playlist, superSub, otherPlaylist, isRightSide, isPlayingSong, isHistorySong) {
    let observedArray = []
    if (songs === undefined && playlist === undefined) {
        throw new Error("Must provide either a song array or a playlist.")
    }

    function draw() {
        let activeSongs = songs || playlist.getSongs()
        playlist.getSongs().forEach(song => {
            gener
        })
    }

    return draw
}

function generateSongElement(song, playlist, superSub, otherPlaylist, isRightSide, isPlayingSong, isHistorySong, iobservedArray) {
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
        newSongItem.classList.toggle('enabled', !song.isDisabled())

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

        if (playlist) {
            removeButton.classList.toggle("inactive")
            removeButton.querySelector('title').textContent = `Remove from ${playlist.getTitle()}`
            removeButton.addEventListener('click', e => {
                removeFromPlaylist(playlist, song)
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
                })
            }
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

export {generateList, generateQueue, generateCompare}