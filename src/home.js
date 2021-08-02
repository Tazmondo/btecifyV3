console.log("home.js")

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

window.playlists = [
    {name: 'music1', url: 'https://static.thenounproject.com/png/17849-200.png', len: 201},
    {name: 'music2', url: 'https://static.thenounproject.com/png/17849-200.png', len: 23},
    {name: 'music4', url: 'https://static.thenounproject.com/png/17849-200.png', len: 2023},
    {name: 'music5', url: 'https://static.thenounproject.com/png/17849-200.png', len: 20},
    {name: 'music6', url: 'https://static.thenounproject.com/png/17849-200.png', len: 2040},
    {name: 'music7', url: 'https://static.thenounproject.com/png/17849-200.png', len: 100},
    {name: 'music8', url: 'https://static.thenounproject.com/png/17849-200.png', len: 150},

]

function drawPage() {
    Array.from(document.querySelectorAll('.playlist-card')).forEach(v => {
        v.remove()
    })
    window.playlists.forEach(v => {
        generatePlaylistCard(v.name, v.url, v.len)
    })
}

drawPage()

console.log("aaaa")
