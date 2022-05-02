console.log("footerPlayer.js running")
import {durationSecondsToMinutes} from "./util.js";
import * as EventController from './controllers/event.js'
import * as RouteController from './controllers/route.js'
import * as api from './controllers/api.js'
import {
    back,
    forward,
    getInfo,
    pause as playerPause,
    play as playerPlay,
    PlayerInfo,
    setRepeat,
    setTime,
    setVolume,
    toggleMute
} from './controllers/music.js'
import {songBase} from "./controllers/types";


function initPage() {
    const {subscribe} = EventController
    const {baseRoute} = RouteController

    let songLength: number | undefined = undefined;
    let currentSong: songBase;

    document.getElementById("shuffle")!.addEventListener("click", (ev: MouseEvent) => {
        let target = ev.currentTarget as HTMLElement
        target.classList.toggle("active");
    })

    document.getElementById("repeat")!.addEventListener("click", ev => {
        let currentTarget = ev.currentTarget as HTMLElement
        currentTarget.classList.toggle("active")
        setRepeat(currentTarget.classList.contains('active'))
    })

    document.getElementById('skip-back')!.addEventListener('click', e => {
        back()
    })

    document.getElementById('view-history-queue')!.addEventListener('click', e => {
        baseRoute('queue')
    })

    document.getElementById('add-new-song-button')!.addEventListener('click', e => {
        baseRoute('newSong')
    })

    function toggleMuteEvent() {
        toggleMute()
    }

    document.getElementById('footer-volume-control')!.addEventListener('click', toggleMuteEvent)
    document.getElementById('footer-volume-control-muted')!.addEventListener('click', toggleMuteEvent)


    let thumbImg = document.querySelector('footer .song-thumb')! as HTMLImageElement
    let title = document.querySelector('footer .songname > strong')! as HTMLElement
    let artist = document.querySelector('footer .artist')! as HTMLElement
    let album = document.querySelector('footer .album')! as HTMLElement

    let playlistTitle = document.querySelector('#player-playlist-header')! as HTMLElement
    let playButton = document.getElementById("play")!
    let pauseButton = document.getElementById("pause")!
    let skipForward = document.getElementById('skip-forward')!
    let playRandom = document.getElementById('play-random')!

    let seekerDiv = document.querySelector(".player .seeker")! as HTMLElement
    let seekerBackBar = seekerDiv.querySelector('.seeker-background')! as HTMLElement
    let seekerFrontBar = seekerDiv.querySelector('.seeker-foreground')! as HTMLElement
    let currentTime = document.getElementById("current-time")!
    let endTime = document.getElementById('end-time')!

    let volumeSeeker = document.querySelector('.volume-seeker')! as HTMLElement
    let volumeBack = volumeSeeker.querySelector('.seeker-background')! as HTMLElement
    let volumeFront = volumeSeeker.querySelector('.seeker-foreground')! as HTMLElement
    let volumeButton = document.querySelector('#footer-volume-control')! as HTMLElement
    let volumeButtonMuted = document.querySelector('#footer-volume-control-muted')! as HTMLElement


    function play() {
        playerPlay()
        playButton.classList.toggle("inactive")
        pauseButton.classList.toggle("inactive")
    }

    function pause() {
        playerPause()
        playButton.classList.toggle("inactive")
        pauseButton.classList.toggle("inactive")
    }

    playButton.addEventListener("click", play)
    pauseButton.addEventListener("click", pause)

    playRandom.addEventListener('click', e => forward())
    skipForward.addEventListener('click', e => forward())


    function getMousePosition(e: MouseEvent, target: HTMLElement) {
        // e = Mouse click event.
        let rect = target.getBoundingClientRect();
        let x = e.clientX - rect.left; //x position within the element.
        let y = e.clientY - rect.top;  //y position within the element.
        return [x, y]
    }

    function getSongTimeFromPercentage(percentage: number) {
        if (songLength) {
            let crudeTime = (percentage / 100) * songLength
            let wholeTime = Math.round(crudeTime)
            return durationSecondsToMinutes(wholeTime)
        }
        return '0:00'
    }

    function updateSeeker(seconds: number) {
        if (songLength) {
            let percentage = seconds / songLength * 100

            if (percentage < 0) {
                percentage = 0
            } else if (percentage > 100) {
                percentage = 100
            }
            seekerFrontBar.style.width = `${percentage}%`
            currentTime.innerText = getSongTimeFromPercentage(percentage)
        }
    }

    function seekerClick(e: MouseEvent) {
        if (songLength == undefined) return

        let oldX = 0;
        let currentEvent = e

        function moveFunc(e: MouseEvent) {
            let relativeX = getMousePosition(e, seekerBackBar)[0]
            let time = relativeX / seekerBackBar.clientWidth * songLength!
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

        function mouseMove(e: MouseEvent) {
            currentEvent = e
        }
        document.addEventListener("mousemove", mouseMove)
        document.addEventListener("mouseup", e => {
            document.removeEventListener("mousemove", mouseMove)
            clearInterval(interval)
        }, {once: true})
    }

    function volumeClick(e: MouseEvent) {

        function moveFunc(e: MouseEvent) {
            let relativeX = getMousePosition(e, volumeBack)[0]
            let volume = relativeX / volumeBack.clientWidth
            if (volume < 0) {
                volume = 0
            }
            if (volume > 1) {
                volume = 1
            }

            toggleMute(false)
            setVolume(volume)
        }

        moveFunc(e)
        document.addEventListener("mousemove", moveFunc)
        document.addEventListener("mouseup", e => {
            document.removeEventListener("mousemove", moveFunc)
        }, {once: true})
    }

    volumeSeeker.addEventListener("mouseup", volumeClick)

    function drawPage(info: PlayerInfo) {
        let song = info?.playingSong
        let playlist = info?.currentPlaylist
        let paused = info?.paused
        let volume = info?.volume
        let queue = info?.queue
        let muted = info?.muted
        if (isNaN(volume) || volume === undefined) {
            volume = 0.5
        }

        playlistTitle.innerText = playlist?.getTitle() || " \n " // Take up same amount of height as if it had text.

        if (song) {
            songLength = song.duration ?? undefined

            if (song !== currentSong) {
                let thumb = api.getThumbUrl(song.id)
                thumbImg.src = thumb ?? ""
                thumbImg.classList.toggle('hidden', false)
                thumbImg.style.visibility = 'visible'
            }

            currentSong = song

            title.innerText = song.title
            artist.innerText = song.artist?.title ?? ""
            album.innerText = song.album?.title ?? ""
            endTime.innerText = song.duration !== null ? durationSecondsToMinutes(song.duration) : ""

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

        skipForward.classList.toggle('inactive', !playlist) // boolean conversion
        playRandom.classList.toggle('inactive', !!playlist)

        if (muted) {
            volumeFront.style.width = `0%`
            volumeButton.classList.toggle('inactive', true)
            volumeButtonMuted.classList.toggle('inactive', false)
        } else {
            volumeFront.style.width = `${volume * 100}%`
            volumeButton.classList.toggle('inactive', false)
            volumeButtonMuted.classList.toggle('inactive', true)
        }

    }

    function updateSongTime(time: number) {
        currentTime.innerText = durationSecondsToMinutes(Math.floor(time))
        updateSeeker(time)
    }

    function updateAddButton(data: any) {
        let addButton = document.querySelector('#add-new-song-button')!
        let title = addButton.querySelector('title')!
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
