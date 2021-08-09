console.log("homePage.js running...")
import { EventController, ObjectController, MusicController } from './controller.js'

function initPage() {
    const {subscribe} = EventController
    const {getPlaylistArray} = ObjectController

    function generatePlaylistCard(playlistName, thumbnailURLPromise, numSongs) {
        let container = document.getElementsByClassName("playlists-container")[0]

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
            let img = card.querySelector('.img-div');
            img.style.backgroundImage = `url(${res})`
        })

    }

    function drawPage() {
        Array.from(document.querySelectorAll('.playlist-card')).forEach(v => {
            v.remove()
        })
        getPlaylistArray().forEach(v => {
            generatePlaylistCard(v.getTitle(), v.getThumb(), v.getLength())
        })
    }

    drawPage()
    subscribe('playlist', drawPage)
}

export default initPage