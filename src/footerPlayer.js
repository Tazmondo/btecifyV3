console.log("footerPlayer.js running")
import {durationSecondsToMinutes} from "./util.js";
import {EventController, MusicController} from "./controller.js";

function initPage() {
    const {subscribe} = EventController
    const {setTime, setVolume} = MusicController

    let songLength = undefined;

    // Used as the difference between quieter sounds is more audible than louder sounds, so the volume slider
    // should have a higher range at lower volumes.
    let volMod = 2.5

    document.getElementById("shuffle").addEventListener("click", ev => {
        ev.currentTarget.classList.toggle("active")
    })

    document.getElementById("repeat").addEventListener("click", ev => {
        ev.currentTarget.classList.toggle("active")
    })

    let playButton = document.getElementById("play")
    let pauseButton = document.getElementById("pause")

    let thumbImg = document.querySelector('footer .song-thumb');
    let title = document.querySelector('footer .songname > strong');
    let artist = document.querySelector('footer .artist');
    let album = document.querySelector('footer .album');

    let seekerDiv = document.querySelector(".player .seeker")
    let seekerBackBar = seekerDiv.querySelector('.seeker-background')
    let seekerFrontBar = seekerDiv.querySelector('.seeker-foreground')
    let currentTime = document.getElementById("current-time")
    let endTime = document.getElementById('end-time')

    let volumeSeeker = document.querySelector('.volume-seeker')
    let volumeBack = volumeSeeker.querySelector('.seeker-background')
    let volumeFront = volumeSeeker.querySelector('.seeker-foreground')


    function play() {
        MusicController.play()
        playButton.classList.toggle("inactive")
        pauseButton.classList.toggle("inactive")
    }

    function pause() {
        MusicController.pause()
        playButton.classList.toggle("inactive")
        pauseButton.classList.toggle("inactive")
    }

    playButton.addEventListener("click", play)
    pauseButton.addEventListener("click", pause)



    function getMousePosition(e, target) {
        // e = Mouse click event.
        let rect = target.getBoundingClientRect();
        let x = e.clientX - rect.left; //x position within the element.
        let y = e.clientY - rect.top;  //y position within the element.
        return [x, y]
    }

    function getSongTimeFromPercentage(percentage) {
        if (songLength) {
            let crudeTime = (percentage / 100) * songLength
            let wholeTime = Math.round(crudeTime)
            return durationSecondsToMinutes(wholeTime)
        }
        return '0:00'
    }

    function updateSeeker(seconds) {
        if (songLength) {
            let percentage = seconds / songLength * 100

            if (percentage < 0) {
                percentage = 0
            } else if (percentage > 100) {
                percentage = 100
            }
            seekerFrontBar.style = `width: ${percentage}%`
            currentTime.innerText = getSongTimeFromPercentage(percentage)
        }
    }

    function seekerClick(e) {
        let oldX = 0;
        let currentEvent = e

        function moveFunc(e) {
            let relativeX = getMousePosition(e, seekerBackBar)[0]
            let time = relativeX / seekerBackBar.clientWidth * songLength
            updateSeeker(time)
            setTime(time)
        }
        moveFunc(currentEvent)
        let interval = setInterval(() => {
            console.log(currentEvent.clientX, oldX);
            if (currentEvent.clientX !== oldX) {
                moveFunc(currentEvent)
                oldX = currentEvent.clientX
            }
        }, 50)
        function mouseMove(e) {
            currentEvent = e
        }
        document.addEventListener("mousemove", mouseMove)
        document.addEventListener("mouseup", e => {
            document.removeEventListener("mousemove", mouseMove)
            clearInterval(interval)
        }, {once: true})
    }

    function volumeClick(e) {

        function moveFunc(e) {
            let relativeX = getMousePosition(e, volumeBack)[0]
            let volume = relativeX / volumeBack.clientWidth
            if (volume < 0) {volume = 0}
            if  (volume > 1) {volume = 1}

            setVolume(volume ** volMod)
        }

        moveFunc(e)
        document.addEventListener("mousemove", moveFunc)
        document.addEventListener("mouseup", e => {
            document.removeEventListener("mousemove", moveFunc)
        }, {once: true})
    }

    function drawPage(info) {
        let song = info?.currentSong
        let paused = info?.paused

        if (song) {
            songLength = song.getDurationSeconds()

            song.getThumb().then(thumb => {
                thumbImg.src = thumb ?? ""
                thumbImg.style.display = 'initial'
                thumbImg.classList.toggle('hidden', false)
            })

            title.innerText = song.getTitle()
            artist.innerText = song.getArtist()
            album.innerText = song.getAlbum()
            endTime.innerText = durationSecondsToMinutes(song.getDurationSeconds())

            seekerDiv.addEventListener("mousedown", seekerClick)

        } else {
            thumbImg.style.display = 'none'
            title.innerText = ""
            artist.innerText = ""
            album.innerText = ""
            thumbImg.classList.toggle('hidden', true)

            seekerDiv.removeEventListener('mousedown', seekerClick)
        }

        if (paused || !song) {
            playButton.classList.toggle("inactive", false)
            pauseButton.classList.toggle("inactive", true)
        } else {
            playButton.classList.toggle("inactive", true)
            pauseButton.classList.toggle("inactive", false)
        }

        volumeFront.style.width = `${((info?.volume ?? 0.5)** (1/volMod)) * 100}%`
        volumeSeeker.addEventListener('mousedown', volumeClick)
    }

    function updateSongTime(time) {
        currentTime.innerText = durationSecondsToMinutes(Math.floor(time))
        updateSeeker(time)
    }

    drawPage()
    subscribe('playing', drawPage)
    subscribe('songtime', updateSongTime)
}

export default initPage