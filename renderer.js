console.log("renderer.js running...")



function randomColourCSS() {
    let r = Math.floor(Math.random()*256)
    let g = Math.floor(Math.random()*256)
    let b = Math.floor(Math.random()*256)
    return `rgb(${r}, ${g}, ${b})`
}

window.api.receiveMoved(() => {
    // [...document.querySelectorAll('*')].map((v) => {
    //     v.style.backgroundColor = randomColourCSS()
    // })
})

document.getElementById("shuffle").addEventListener("click", ev => {
    ev.currentTarget.classList.toggle("active")
})

document.getElementById("repeat").addEventListener("click", ev => {
    ev.currentTarget.classList.toggle("active")
})

let playButton = document.getElementById("play")
let pauseButton = document.getElementById("pause")

function togglePlayPause(ev) {
    playButton.classList.toggle("inactive")
    pauseButton.classList.toggle("inactive")
}

playButton.addEventListener("click", togglePlayPause)
pauseButton.addEventListener("click", togglePlayPause)

let seekerDiv = document.getElementsByClassName("seeker")[0]
let seekerBackBar = document.getElementsByClassName("seeker-background")[0]
let seekerFrontBar = document.getElementsByClassName("seeker-foreground")[0]
let seekerThumb = document.getElementsByClassName("seeker-thumb")[0]
let currentTime = document.getElementById("current-time")

function getMousePosition(e, target) {
    // e = Mouse click event.
    let rect = target.getBoundingClientRect();
    let x = e.clientX - rect.left; //x position within the element.
    let y = e.clientY - rect.top;  //y position within the element.
    return [x, y]
}

function getSongTimeFromPercentage(percentage, duration) {
    let crudeTime = (percentage / 100) * duration
    let wholeTime = Math.round(crudeTime)
    let minutes = Math.floor(wholeTime/60)
    let seconds = wholeTime % 60
    if (seconds < 10) {
        seconds = `0${seconds}`
    }
    return `${minutes}:${seconds}`
}

function updateSeeker(e, target) {
    const songSeconds = 300

    let relativeX = getMousePosition(e, seekerBackBar)[0]
    let widthPercentage = relativeX / seekerBackBar.clientWidth * 100
    if (widthPercentage < 0) {
        widthPercentage = 0
    } else if (widthPercentage > 100) {
        widthPercentage = 100
    }
    seekerFrontBar.style = `width: ${widthPercentage}%`
    currentTime.innerText = getSongTimeFromPercentage(widthPercentage, songSeconds)

    console.log(`Set duration to ${widthPercentage}%`)
}

seekerDiv.addEventListener("mousedown", e => {
    updateSeeker(e)

   document.addEventListener("mousemove", updateSeeker)
    document.addEventListener("mouseup", e => {
        document.removeEventListener("mousemove", updateSeeker)
    }, {once: true})
})

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
