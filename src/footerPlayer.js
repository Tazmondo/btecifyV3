console.log("footerPlayer.js running")
import {durationSecondsToMinutes} from "./util.js";
import {EventController, MusicController, RouteController} from "./controller.js";

function initPage() {
    const {subscribe} = EventController
    const {setTime, setVolume, forward, back, setRepeat, getInfo} = MusicController
    const {addView} = RouteController

    let songLength = undefined;
    let currentSong;

    document.getElementById("shuffle").addEventListener("click", ev => {
        ev.currentTarget.classList.toggle("active")
    })

    document.getElementById("repeat").addEventListener("click", ev => {
        ev.currentTarget.classList.toggle("active")
        setRepeat(ev.currentTarget.classList.contains('active'))
    })

    document.getElementById('skip-back').addEventListener('click', e=>{
        back()
    })

    document.getElementById('view-history-queue').addEventListener('click', e=>{
        addView('queue')
    })

    document.getElementById('add-new-song-button').addEventListener('click', e=> {
        addView('newSong')
    })


    let thumbImg = document.querySelector('footer .song-thumb');
    let title = document.querySelector('footer .songname > strong');
    let artist = document.querySelector('footer .artist');
    let album = document.querySelector('footer .album');

    let playlistTitle = document.querySelector('#player-playlist-header')
    let playButton = document.getElementById("play")
    let pauseButton = document.getElementById("pause")
    let skipForward = document.getElementById('skip-forward');
    let playRandom = document.getElementById('play-random');

    let seekerDiv = document.querySelector(".player .seeker")
    let seekerBackBar = seekerDiv.querySelector('.seeker-background')
    let seekerFrontBar = seekerDiv.querySelector('.seeker-foreground')
    let currentTime = document.getElementById("current-time")
    let endTime = document.getElementById('end-time')

    let volumeSeeker = document.querySelector('.volume-seeker')
    let volumeBack = volumeSeeker.querySelector('.seeker-background')
    let volumeFront = volumeSeeker.querySelector('.seeker-foreground')
    let volumeButton = document.querySelector('#footer-volume-control')
    let volumeButtonMuted = document.querySelector('#footer-volume-control-muted')


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

    playRandom.addEventListener('click', e => forward())
    skipForward.addEventListener('click', e => forward())


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

            setVolume(volume)
        }

        moveFunc(e)
        document.addEventListener("mousemove", moveFunc)
        document.addEventListener("mouseup", e => {
            document.removeEventListener("mousemove", moveFunc)
        }, {once: true})
    }
    volumeSeeker.addEventListener('mousedown', volumeClick)

    function drawPage(info) {
        let song = info?.currentSong
        let playlist = info?.currentPlaylist
        let paused = info?.paused
        let volume = info?.volume
        let queue = info?.queue
        if (isNaN(volume) || volume === undefined) {
            volume = 0.5
        }

        playlistTitle.innerText = playlist?.getTitle() || " \n " // Take up same amount of height as if it had text.

        if (song) {
            songLength = song.getDurationSeconds()

            if (song !== currentSong) {
                thumbImg.style.visibility = 'hidden'
                song.getThumb().then(thumb => {
                    if (song === currentSong) { // Make sure you dont overwrite thumbnail of another song.
                        thumbImg.src = thumb ?? ""
                        thumbImg.style.visibility = 'visible'
                        thumbImg.classList.toggle('hidden', false)
                    }
                })
            }

            currentSong = song

            title.innerText = song.getTitle()
            artist.innerText = song.getArtist()
            album.innerText = song.getAlbum()
            endTime.innerText = durationSecondsToMinutes(song.getDurationSeconds())

            seekerDiv.addEventListener("mousedown", seekerClick)

        } else {
            thumbImg.style.visibility = 'hidden'
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

        skipForward.classList.toggle('inactive', !(queue?.length > 0))
        playRandom.classList.toggle('inactive', queue?.length > 0)

        volumeFront.style.width = `${volume * 100}%`
        if (volume === 0) {
            volumeButton.classList.toggle('inactive', true)
            volumeButtonMuted.classList.toggle('inactive', false)
        } else {
            volumeButton.classList.toggle('inactive', false)
            volumeButtonMuted.classList.toggle('inactive', true)
        }

    }

    function updateSongTime(time) {
        currentTime.innerText = durationSecondsToMinutes(Math.floor(time))
        updateSeeker(time)
    }

    function updateAddButton(data) {
        let addButton = document.querySelector('#add-new-song-button');
        let title = addButton.querySelector('title')
        if (data) {
            addButton.classList.toggle('active', true)
            title.textContent = `Add ${data.title}`
        } else {
            addButton.classList.toggle('active', true)
            title.textContent = "Add Song"
        }
    }

    drawPage(getInfo())
    subscribe('playing', drawPage)
    subscribe('songtime', updateSongTime)
    subscribe('clipboard', updateAddButton)
}

export default initPage