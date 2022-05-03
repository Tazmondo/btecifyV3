import * as EventController from '../controllers/event.js'
import * as ObjectController from '../controllers/object.js'
import {getDeepPlaylistArray} from '../controllers/object.js'
import * as MusicController from '../controllers/music.js'
import {PlaylistInterface} from "../controllers/objects/playlist";

console.log("homePage.js running...")

function initPage() {
    const {subscribe, unSubscribe} = EventController
    const {
        getPlaylistArray,
        getPlaylistFromTitle,
        getPlaylistsWithSong,
        addToPlaylist,
        removeFromPlaylist
    } = ObjectController
    const {setPlaylist, getInfo} = MusicController

    let page = document.getElementById('home-nav-page')!

    function generatePlaylistCard(playlistName: string, thumb: Promise<string>, numSongs: number, selected: boolean) {
        let playlistObject = getPlaylistFromTitle(playlistName) as PlaylistInterface;
        if (playlistObject == undefined) {
            return false
        }

        let container = page.getElementsByClassName("playlists-container")[0]

        container.insertAdjacentHTML('beforeend',
            `<div class="playlist-card${selected ? " selected" : ""}" data-context="playlist">
            <div class="img-div"></div>
            <div>
                <h3>${playlistName}</h3>
                <em>${numSongs} ${numSongs === 1 ? "song" : "songs"}</em>
                <svg class="svg-button" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                    <title>Play</title>
                </svg>
            </div>
        </div>`)

        let card = container.lastElementChild!
        let img: HTMLImageElement = card.querySelector('.img-div')!

        thumb.then(res => {
            img.style.backgroundImage = `url(${res})`
        })

        // card.addEventListener('dblclick', e => {
        //     baseRoute('playlistView', [playlistObject])
        // })

        card.querySelector('.svg-button')!.addEventListener('click', e => {
            setPlaylist(playlistObject)
            e.stopPropagation() // so that you dont mess with playlists due to below function
        })


        card.addEventListener('click', e => {
            let song = getInfo().playingSong
            if (song !== undefined) {
                if (card.classList.contains('selected')) {
                    removeFromPlaylist(playlistObject, song)
                } else {
                    addToPlaylist(playlistObject, song)
                }
            }
        })

    }

    function unDrawPage() {
        Array.from(page.querySelectorAll('.playlist-card')).forEach(v => {
            v.remove()
        })
    }

    function drawPage() {
        unDrawPage();


        let song = getInfo().playingSong
        let playlistsToSelect = song === undefined ? [] : getPlaylistsWithSong(song.id)

        getDeepPlaylistArray().forEach(v => {
            generatePlaylistCard(v.getTitle(), v.getThumb(), v.getLength(),
                playlistsToSelect.some(playlistId => playlistId === v.getId())
            )
        })
    }

    drawPage()

    subscribe('playlist', drawPage)
    subscribe('playing', drawPage)

    return [() => {
        unSubscribe('playlist', drawPage)
        unSubscribe('playing', drawPage)

    }, page]


}

export default initPage
