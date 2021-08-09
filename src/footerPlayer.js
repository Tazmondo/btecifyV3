console.log("footerPlayer.js running")

import {durationSecondsToMinutes} from "./util.js";
import {playSong, subscribe} from "./controller.js";

let paused = false;

document.getElementById("shuffle").addEventListener("click", ev => {
    ev.currentTarget.classList.toggle("active")
})

document.getElementById("repeat").addEventListener("click", ev => {
    ev.currentTarget.classList.toggle("active")
})

let playButton = document.getElementById("play")
let pauseButton = document.getElementById("pause")

function play() {

}

function pause() {

}

playButton.addEventListener("click", play)
pauseButton.addEventListener("click", pause)

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
    return durationSecondsToMinutes(wholeTime)
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
    let moveFunc = (e) => {
        let relativeX = getMousePosition(e, seekerBackBar)[0]
        updateSeeker(relativeX, songLength)
    }
    moveFunc(e)
    document.addEventListener("mousemove", moveFunc)
    document.addEventListener("mouseup", e => {
        document.removeEventListener("mousemove", moveFunc)
    }, {once: true})
})

function drawPage(info) {
    let song = info.currentSong
    let paused = info.paused

    let thumbImg = document.querySelector('footer > img');
    let title = document.querySelector('footer .songname > strong');
    let artist = document.querySelector('footer .artist');
    let album = document.querySelector('footer .album');

    if (song) {

        song.getThumb().then(thumb => {
            thumbImg.src = thumb ?? ""
            thumbImg.style.display = 'initial'
            thumbImg.classList.toggle('hidden', false)
        })

        title.innerText = song.getTitle()
        artist.innerText = song.getArtist()
        album.innerText = song.getAlbum()

    } else {
        thumbImg.style.display = 'none'
        title.innerText = ""
        artist.innerText = ""
        album.innerText = ""
        thumbImg.classList.toggle('hidden', true)
    }

    if (paused || !song) {
        playButton.classList.toggle("inactive", true)
        pauseButton.classList.toggle("inactive", false)
    } else {
        playButton.classList.toggle("inactive", false)
        pauseButton.classList.toggle("inactive", true)
    }
}

subscribe('playing', drawPage)
playSong()
