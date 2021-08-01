function playlist() {
    let header = document.querySelector('header')
    header.insertAdjacentHTML("afterend",`
        <main id="playlist-nav-page">
            <div id="playlist-section-1" class="playlist-section">
                <div id="playlist-select-1" class="playlist-select">
                    <h3>MUSIC</h3>
                </div>
                <div class="select-dropdown">
                    <p>Playlist 1</p>
                    <p>Playlist 2</p>
                </div>
                <div id="playlist-list-1" class="playlist-list">
                    A song
                </div>
            </div>
        </main>
        
        
`)

}

export default playlist