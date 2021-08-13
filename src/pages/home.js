import {pageEntry, pageExit} from "../util.js";

console.log("homePage.js running...")
import { EventController, ObjectController, MusicController } from '../controller.js'

function initPage() {
    const {subscribe, unSubscribe} = EventController
    const {getPlaylistArray,getPlaylistFromTitle, getPlaylistsWithSong} = ObjectController
    const {setPlaylist, getInfo} = MusicController

    let page = document.getElementById('home-nav-page')

    function generatePlaylistCard(playlistName, thumbnailURLPromise, numSongs) {
        let container = page.getElementsByClassName("playlists-container")[0]

        container.insertAdjacentHTML('beforeend',
            `<div class="playlist-card">
            <div class="img-div"></div>
            <div>
                <h3>${playlistName}</h3>
                <em>${numSongs} ${numSongs === 1 ? "song" : "songs"}</em>
                <svg class="svg-button" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                    <title>Play</title>
                </svg>
            </div>
        </div>`)

        let card = container.lastElementChild
        thumbnailURLPromise.then( res => {
            if (res) {
                let img = card.querySelector('.img-div');
                img.style.backgroundImage = `url(${res})`
            }
        })

        card.querySelector('.svg-button').addEventListener('click', e=>{
            setPlaylist(getPlaylistFromTitle(playlistName))
        })

    }

    function unDrawPage() {
        Array.from(page.querySelectorAll('.playlist-card')).forEach(v => {
            v.remove()
        })
    }

    function drawPage() {
        unDrawPage();

        getPlaylistArray().forEach(v => {
            generatePlaylistCard(v.getTitle(), v.getThumb(), v.getLength())
        })
    }

    function highlightPlayingSongPlaylists(info) {
        let song = info.currentSong
        if (song) {
            let playlistCards = page.querySelectorAll('.playlists-container > .playlist-card')
            let playlistsToSelect = getPlaylistsWithSong(song)

            playlistCards.forEach(card => {
                let title = card.querySelector('h3').innerText
                card.classList.toggle("selected", playlistsToSelect.some(playlist => playlist.getTitle() === title))
            })
        }
    }

    pageEntry(page)

    drawPage()
    highlightPlayingSongPlaylists(getInfo())

    subscribe('playlist', drawPage)
    subscribe('playing', highlightPlayingSongPlaylists)


    return function unInitPage() {
        unSubscribe('playlist', drawPage)
        unSubscribe('playing', highlightPlayingSongPlaylists)

        pageExit(page)

    }


}

export default initPage