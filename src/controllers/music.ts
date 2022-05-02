console.log("musicController.js running")
import initVisualiser from './visualiser.js'
import {dispatch} from "./event.js";
import {getRandomSong} from "./object.js";
import {songBase} from "./types";
import {PlaylistInterface} from "./objects/playlist.js";
import * as api from './api.js'


let history: songBase[] = [];
let queue: songBase[] = [];
// let sourceBuffer = undefined; todo: add source buffer functionality (maybe rewrite so that every source buffer has its own player, so each song is played on its own player and then deleted?
//                                     might cause memory leak issues or just not work

let currentSong: songBase | undefined;
let currentPlaylist: PlaylistInterface | undefined;
let playingSong: songBase | undefined;

let repeat: boolean = false;
let muted: boolean = localStorage.muted === "true" || false
let settingSong: boolean = false;

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

async function setSong(song: songBase) {
    if (!settingSong) {
        console.log(`play ${song.title}`)
        settingSong = true;
        try {
            const promisePlay = async (source: string) => {
                return new Promise((resolve, reject) => {
                    player.src = source
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
            // async function waitForSourceBuffer() {
            //     return new Promise(resolve => {
            //         function frame() {
            //             if (sourceBuffer?.fetching === true) {
            //                 setTimeout(frame, 25)
            //             } else {
            //                 resolve(sourceBuffer?.source)
            //             }
            //         }
            //         frame()
            //     })
            // }
            // if (sourceBuffer?.song === song) {
            //     res = await waitForSourceBuffer()
            // } else {
            //     res = await song.getSource()
            // }
            // sourceBuffer = undefined
            res = api.getSrcUrl(song.id)
            try {
                await promisePlay(res)
            } catch (e) {
                throw e
            }

            return true
        } catch (e) {
            console.error("setSong() failed");

            if (e instanceof Error) console.error(e.message);
            throw e
        } finally {
            settingSong = false
            currentSong = song
        }
    }
    return false
}

function songEnded(depth = 0) {
    if (depth > 10) {
        console.log("maximum songended depth reached");
        return
    }
    if (!settingSong) {
        if (currentPlaylist) {
            while (queue.length < 50 && queue.length < Math.ceil(currentPlaylist.getLength() / 2)) {
                let randomSong = currentPlaylist.getRandomFilteredSong(queue.map(value => value.id));
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
            let nextSong: songBase = queue.shift()!;  // Because queue length greater than 0
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
                // if (queue.length > 0) {
                //     let bufferSong = queue[0]
                //     sourceBuffer = {song: bufferSong, source: undefined, fetching: true}
                //     bufferSong.getSource().then(res => {
                //         if (sourceBuffer.song === bufferSong) {
                //             sourceBuffer.source = res
                //             sourceBuffer.fetching = false
                //         }
                //     }).catch(reason => sourceBuffer = undefined)
                // }

            })
        }
    }
}

// This has been done to fix an issue where sometimes a song would reach the end of its
// duration, but fail to end properly.
// Im not sure whether it was because the ended event didnt fire properly but
// either way this should fix it.
player.addEventListener('timeupdate', e => {
    if (player.currentTime === player.duration) {
        console.log("time ended");
        if (repeat) {
            player.play()
        } else {
            songEnded()
        }
    }
    dispatch('songtime')
})

// player.addEventListener('ended', e => {
//     console.log("ended");
//     // if (repeat) {
//     //     player.play()
//     // } else {
//     //     songEnded()
//     // }
// })

export function play() {
    player.autoplay = true

    // No dispatch is needed here apparently?
    player.play()
}

export function pause() {
    player.autoplay = false

    // Apparently no dispatches are needed here?

    // Should only dispatch once to prevent excessive drawing
    // player.addEventListener('pause', () => {
    //     console.log("b");
    //     // dispatch('playing')
    // }, {once: true})

    player.pause()
}

export function togglePlaying() {
    if (player.paused) {
        play()
    } else {
        pause()
    }
    dispatch('playing')
}

export type PlayerInfo = {
    playingSong: typeof playingSong,
    currentPlaylist: typeof currentPlaylist,
    history: typeof history,
    queue: typeof queue,
    repeat: boolean,
    muted: boolean,
    volume: number,
    paused: boolean,
    time: number,
}

export function getInfo(): PlayerInfo {
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

export function forceSetSong(song: songBase) {
    currentPlaylist = undefined
    queue = []
    queue.unshift(song)
    // sourceBuffer = undefined
    songEnded(10)
}

export function setSongFromUrl(urlStream: string) {
    currentSong = undefined
    player.src = urlStream
    play()
}

export function setPlaylist(playlist: PlaylistInterface) {
    currentPlaylist = playlist
    queue = []
    if (playingSong === undefined) {
        songEnded()
    }
    // history = []
    dispatch('playing')
}

export function getTime(): number {
    return player.currentTime
}

export function setTime(seconds: number) {
    player.play() // In case the song has ended and playback has stopped.
    player.currentTime = seconds
    return player.currentTime
}

export function setVolume(volume: number) {
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
    if (nextSong && currentSong) {
        queue.unshift(currentSong)
        setSong(nextSong).finally(() => {
            dispatch('playing')
        })
    }
}

export function setRepeat(bool: boolean) {
    repeat = bool
    dispatch('playing')
}

export function toggleMute(force?: boolean) {
    muted = force ?? !muted
    localStorage.muted = muted
    muted ? player.volume = 0 : player.volume = unModdedVol ** volMod
    dispatch('playing')
}

export function removeFromQueue(song: songBase) {
    // todo: implement removeFromQueue
}
