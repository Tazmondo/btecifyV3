console.log("home.js running...")
import {getPlaylistArray, subscribe} from "./controller.js";

function generatePlaylistCard(playlistName, thumbnailURL, numSongs, playFunction) {
    let container = document.getElementsByClassName("playlists-container")[0]

    container.insertAdjacentHTML('beforeend',
        `<div class="playlist-card">
        <img src="${thumbnailURL}" alt="${playlistName}">
        <div>
            <h3>${playlistName}</h3>
            <em>${numSongs} ${numSongs === 1 ? "song" : "songs"}</em>
            <svg class="svg-button" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                <title>Play</title>
            </svg>
        </div>
    </div>`)

}

function drawPage() {
    Array.from(document.querySelectorAll('.playlist-card')).forEach(v => {
        v.remove()
    })
    getPlaylistArray().forEach(v => {
        generatePlaylistCard(v.getName(), v.getThumb(), v.getLength())
    })
}

drawPage()
subscribe('playlist', drawPage)
