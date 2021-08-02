let paused = false

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

function updateSeeker(relativeX, songSeconds) {

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
    const songLength = 300
    paused = true

    let moveFunc = (e) => {
        let relativeX = getMousePosition(e, seekerBackBar)[0]
        updateSeeker(relativeX, songLength)
    }
    document.addEventListener("mousemove", moveFunc)
    document.addEventListener("mouseup", e => {
        document.removeEventListener("mousemove", moveFunc)
        paused = false
    }, {once: true})
})

function player() {
}
export default player