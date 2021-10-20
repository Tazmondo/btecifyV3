import {subscribe, unSubscribe} from '../controllers/event.js'
import SongElement from './song-element.js'
import {getInfo} from '../controllers/music.js'
import {copyArray, isSongInSongArray} from '../util.js'

/**
 * @typedef {string} listType
 */

/**
 * Take an element and turn it into a songlist
 * @param element {HTMLElement|Node} Must have class song-list
 * @param songs {Song[]}
 * @returns {Object} A playlist object
 */
function generateList(element, songs) {
    return generateSongList(listType.NORMAL, element, songs)
}

function generatePlaylist(element, playlist) {
    return generateSongList(listType.PLAYLIST, element, playlist.getSongs(), playlist)
}

/**
 * Take an element and turn it into a songlist
 * @param element {HTMLElement|Node} Must have class song-list
 * @param songs {Song[]}
 * @param playlist {Playlist}
 * @param otherPlaylist {Playlist}
 * @param isRightSide {boolean}
 * @returns {Object} A playlist object
 */
function generateCompare(element, songs, playlist, otherPlaylist, isRightSide) {
    return generateSongList(listType.COMPARE, element, songs, playlist, otherPlaylist, isRightSide)
}

/**
 * Take an element and turn it into a songlist
 * @param element {HTMLElement|Node} Must have class song-list
 * @returns {Object} A playlist object
 */
function generateQueue(element) {
    return generateSongList(listType.QUEUE, element)
}

/**
 * @enum {listType}
 */
const listType = {
    NORMAL: "normal",
    COMPARE: "compare",
    QUEUE: "queue",
    PLAYLIST: "playlist"
}

/**
 * Take an element and turn it into a songlist
 * @param type {listType}
 * @param element {HTMLElement|Node} Must have class song-list
 * @param songs {Song[]?}
 * @param playlist {Playlist?}
 * @param otherPlaylist {Playlist?}
 * @param isRightSide {boolean?}
 * @returns {Object} A playlist object
 */
function generateSongList(type, element, playlist, otherPlaylist, isRightSide) {
    let observed = []
    let drawQueued = false

    function getSongs() {
        switch (type) {
            case listType.NORMAL:
                return playlist.getSongs()
            case listType.PLAYLIST:
                return playlist.getSongs()
            case listType.COMPARE:
                return playlist.getSongs()
            case listType.QUEUE:
                let playerInfo = getInfo()
                return playerInfo

        }
    }

    function clearSongs() {
        Array.from(element.childNodes).forEach(node => node.remove())
    }

    let draw;

    if (type === listType.NORMAL) {
        draw = () => {
            clearSongs()
            getSongs().forEach(song => {
                let newElement = SongElement(song)
                element.insertAdjacentElement('beforeend', newElement)
            })
        }
    } else if(type === listType.PLAYLIST) {
        draw = () => {
            clearSongs()
            getSongs().forEach(song => {
                element.insertAdjacentElement('beforeend',
                    SongElement(song, playlist))
            })
        }
    } else if (type === listType.COMPARE) {
        draw = () => {
            console.trace("drawing")
            clearSongs()
            if (playlist) {
                let superSongs = []
                if (otherPlaylist !== undefined) {
                    superSongs = playlist.getSuperSongs(otherPlaylist.getSongs())
                }

                getSongs().forEach(song => {
                    let superSong = isSongInSongArray(superSongs, song)
                    let newElement = SongElement(song, playlist, superSong, otherPlaylist, isRightSide, undefined, undefined, observed)

                    if (superSong) {
                        let superItems = Array.from(element.querySelectorAll('.song-list-item-container.super'))
                        if (superItems.length > 0) {
                            superItems.pop().insertAdjacentElement('afterend', newElement)

                        } else {
                            element.insertAdjacentElement('afterbegin', newElement)
                        }

                    } else {
                        element.insertAdjacentElement('beforeend', newElement)
                    }
                })

                // if (selected[index] === selectedPlaylistTitle) {
                //     setTimeout(() => {
                //         songList.scrollTop = scroll[index]
                //     }, 350)
                // } else {
                //     songList.scrollTop = 0
                // }
            }
        }
    } else if (type === listType.QUEUE) {
        let scroll = true
        let scrollTimeout;
        let currentElement;

        function scrollToCurElement() {
        if (currentElement) {
            currentElement.scrollIntoView()
            element.scrollBy(0, -element.clientHeight/2)
        }
    }

        function resetScrollTimeout(e) {
            if (scrollTimeout) clearTimeout(scrollTimeout)
            console.log("resetting");
            scroll = false
            scrollTimeout = setTimeout(() => {
                scroll = true
                scrollToCurElement()
            }, 15000)
        }

        element.addEventListener('mousemove', resetScrollTimeout)

        function addSong(song, playing, past) {
            let insertedElement = SongElement(song, undefined, undefined, undefined, undefined, playing, past, observed);
            element.insertAdjacentElement('beforeend', insertedElement)
            if (playing) {
                currentElement = insertedElement
            }
        }

        draw = () => {
            let info = getSongs()
            let queue = info.queue
            let history = info.history
            let currentSong = info.currentSong

            let currentArray = []
            if (currentSong) {
                currentArray = [currentSong]
            }

            let temp = copyArray(observed)
            let old = Array.from(element.childNodes)
            observed = temp

            history.forEach(song => addSong(song, false, true))
            currentArray.forEach(song => addSong(song, true, false))
            queue.forEach(song => addSong(song, false, false))

            old.forEach(v => v.remove())

            console.log(scroll)
            if (currentElement && scroll) {
                setTimeout(() => {
                    scrollToCurElement()
                }, 50)
            }
        }
    }

    function setPlaylist(iPlaylist) {
        playlist = iPlaylist
        draw()
    }

    function setOtherPlaylist(iPlaylist) {
        otherPlaylist = iPlaylist
        draw()
    }

    function frame() {
        if (drawQueued) {
            draw()
            drawQueued = false
        }
        requestAnimationFrame(frame)
    }

    requestAnimationFrame(frame)

    return {
        draw() {
            drawQueued = true
    },
        setPlaylist,
        setOtherPlaylist,
        element
    }
}

export {generateList, generateQueue, generateCompare}