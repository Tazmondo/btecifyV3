import {subscribe, unSubscribe} from '../controllers/event.js'
import {SongElement} from './song-element.js'
import {getInfo} from '../controllers/music.js'
import {isSongInSongArray} from '../util.js'

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
 * @param songs {Song[]}
 * @param playlist {Playlist}
 * @param otherPlaylist {Playlist?}
 * @param isRightSide {boolean}
 * @param isPlayingSong {boolean}
 * @param isHistorySong {boolean}
 * @returns {Object} A playlist object
 */
function generateSongList(type, element, songs, playlist, otherPlaylist, isRightSide) {
    observed = []
    function getSongs() {
        switch (type) {
            case listType.NORMAL:
                return songs
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

    if (type == listType.NORMAL) {
        draw = () => {
            clearSongs()
            getSongs().forEach(song => {
                let newElement = SongElement(song)
                element.insertAdjacentElement('beforeend', newElement)
            })
        }
    } else if(type == listType.PLAYLIST) {
        draw = () => {
            clearSongs()
            getSongs().forEach(song => {
                element.insertAdjacentElement('beforeend',
                    SongElement(song, playlist))
            })
        }
    } else if (type == listType.COMPARE) {
        draw = () => {
            let superSongs = []
            if (otherPlaylist !== undefined) {
                superSongs = playlist.getSuperSongs(otherPlaylist.getSongs())
            }

            clearSongs()
            getSongs().forEach(song => {
                let superSong = isSongInSongArray(superSongs, song)
                let newElement = generateSongElement(song, selectedPlaylist, superSong, otherPlaylist, isRightSide, undefined, undefined, observed)

                if (superSong) {
                    let superItems = // todo: finish me
                }
            })
        }
    }

    return {
        draw,

    }
}

export {generateList, generateQueue, generateCompare}