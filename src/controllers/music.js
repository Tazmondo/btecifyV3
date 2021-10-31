
console.log("musicController.js running")
import initVisualiser from './visualiser.js'
import {dispatch} from "./event.js";
import {getRandomSong} from "./object.js";

let history = [];
let queue = [];
let sourceBuffer = undefined;

let currentSong;
let currentPlaylist;
let playingSong;

let repeat = false;
let muted = localStorage.muted === "true" || false
let settingSong = false;

let player = new Audio()
player.autoplay = true
player.crossOrigin = 'anonymous'
player.load()
player.play()

player.volume = muted ? 0 : (localStorage.volume || 0.1)
let volMod = 2.5;
let unModdedVol = player.volume ** (1 / volMod)

initVisualiser(player)

Object.assign(window, {player}) // for testing

async function setSong(song) {
    if (!settingSong) {
        console.log(`play ${song.getTitle()}`)
        settingSong = true;
        try {
            const promisePlay = async (res) => {
                return new Promise((resolve, reject) => {
                    player.src = res
                    player.onplaying = e => {
                        playingSong = song
                        resolve(e)
                    }
                    player.onerror = e => {
                        console.log(e);
                        reject(e)
                    }
                    play()
                })
            }
            let res;
            async function waitForSourceBuffer() {
                return new Promise(resolve => {
                    function frame() {
                        if (sourceBuffer?.fetching === true) {
                            setTimeout(frame, 25)
                        } else {
                            resolve(sourceBuffer?.source)
                        }
                    }
                    frame()
                })
            }
            if (sourceBuffer?.song === song) {
                res = await waitForSourceBuffer()
            } else {
                res = await song.getSource()
            }
            sourceBuffer = undefined
            try {
                await promisePlay(res)
            } catch (e) {
                throw e
            }

            return true
        } catch (e) {
            console.error("setSong() failed");
            console.error(e.message);
            throw e
        } finally {
            settingSong = false
            currentSong = song
        }
    }
    return false
}

player.addEventListener('timeupdate', e => {
    dispatch('songtime')
})

function songEnded(depth = 0) {
    if (depth > 10) {
        console.log("maximum songended depth reached");
        return
    }
    if (!settingSong) {
        if (currentPlaylist) {
            while (queue.length < 50 && queue.length < Math.ceil(currentPlaylist.getLength() / 2)) {
                let randomSong = currentPlaylist.getRandomFilteredSong(queue);
                if (randomSong) {
                    queue.push(randomSong)
                } else {
                    console.error("QUEUE FAILED!?!?!?!?")
                    break
                }
            }
        }
        if (queue.length === 0 && currentPlaylist === undefined) {
            queue.push(getRandomSong())
        }
        if (queue.length > 0) {
            let nextSong = queue.shift();
            let oldSong = currentSong
            setSong(nextSong).then(res => {
                if (!res) {
                    songEnded(depth + 1)
                }
                dispatch('playing')
            }).catch(e => {
                songEnded(depth + 1)
            }).finally(() => {
                if (oldSong) {
                    history.push(oldSong)
                }

                // Buffer the next song for seamless play.
                if (queue.length > 0) {
                    let bufferSong = queue[0]
                    sourceBuffer = {song: bufferSong, source: undefined, fetching: true}
                    bufferSong.getSource().then(res => {
                        if (sourceBuffer.song === bufferSong) {
                            sourceBuffer.source = res
                            sourceBuffer.fetching = false
                        }
                    }).catch(reason => sourceBuffer = undefined)
                }

            })
        }
    }
}

player.addEventListener('ended', e => {
    if (repeat) {
        player.play()
    } else {
        songEnded()
    }
})

// Caused unnecessary drawing and bugs.

// function dispatchPlaying() {
//     dispatch('playing')
// }

// player.onplay = dispatchPlaying
// player.onplaying = dispatchPlaying
// player.onseeked = dispatchPlaying
// player.onstalled = dispatchPlaying
// player.onpause = dispatchPlaying

export function play() {
    player.autoplay = true
    player.play()
}

export function pause() {
    player.autoplay = false
    player.pause()
}

export function togglePlaying() {
    if (player.paused) {
        play()
    } else {
        pause()
    }
}

export function getInfo() {
    return {
        playingSong,
        currentPlaylist,
        history,
        queue,
        repeat,
        muted,
        volume: unModdedVol,
        paused: player.paused || player.ended,
        time: player.currentTime,
    }
}

export function forceSetSong(song) {
    currentPlaylist = undefined
    queue = []
    queue.unshift(song)
    sourceBuffer = undefined
    songEnded(10)
}

export function setSongFromUrl(urlStream) {
    currentSong = undefined
    player.src = urlStream
    play()
}

export function setPlaylist(playlist) {
    currentPlaylist = playlist
    queue = []
    songEnded()
    history = []
    dispatch('playing')
}

export function getTime() {
    return player.currentTime
}

export function setTime(seconds) {
    player.play() // In case the song has ended and playback has stopped.
    player.currentTime = seconds
    return player.currentTime
}

export function setVolume(volume) {
    if (volume < 0) volume = 0
    if (volume > 1) volume = 1
    unModdedVol = volume
    if (!muted) player.volume = volume ** volMod
    localStorage.volume = volume ** volMod
    dispatch('playing')
}

export function forward() {
    songEnded()
}

export function back() {
    let nextSong = history.pop()
    if (nextSong) {
        queue.unshift(currentSong)
        setSong(nextSong).finally(() => {
            dispatch('playing')
        })
    }
}

export function setRepeat(bool) {
    repeat = bool
}

export function toggleMute(force) {
    muted = force ?? !muted
    localStorage.muted = muted
    muted ? player.volume = 0 : player.volume = unModdedVol ** volMod
    dispatch('playing')
}
