function home() {
    let header = document.getElementsByTagName('header')[0]
    header.insertAdjacentHTML('afterend',
        `
        <main id="home-nav-page">
        <h2>Your Playlists</h2>
        <div class="playlists-container">
            <div id="placeholder-card" class="playlist-card">
                <img src="https://static.thenounproject.com/png/17849-200.png" alt="PLAYLIST NAME">
                <div>
                    <h3>PLAYLIST NAME</h3>
                    <em>50 songs</em>
                    <svg class="svg-button" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                        <title>Play</title>
                    </svg>
                </div>
            </div>
        </div>
    </main>
`)

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

    generatePlaylistCard("music", "https://static.thenounproject.com/png/17849-200.png", 123)
    generatePlaylistCard("music", "https://static.thenounproject.com/png/17849-200.png", 123)
    generatePlaylistCard("music", "https://static.thenounproject.com/png/17849-200.png", 123)
    generatePlaylistCard("music", "https://static.thenounproject.com/png/17849-200.png", 123)
    generatePlaylistCard("music", "https://static.thenounproject.com/png/17849-200.png", 123)
    generatePlaylistCard("music", "https://static.thenounproject.com/png/17849-200.png", 123)
    generatePlaylistCard("music", "https://static.thenounproject.com/png/17849-200.png", 123)
}

export default home
