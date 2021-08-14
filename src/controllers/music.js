console.log("musicController.js running")


function MusicPlayer(dispatch) {
    let history = [];
    let queue = [];
    
    let currentSong;
    let currentPlaylist;
    
    let repeat = false;
    let settingSong = false;


    let player = new Audio()
    player.autoplay = true

    player.volume = localStorage.volume || 0.1
    let volMod = 2.5;
    let unModdedVol = player.volume ** (1/volMod)

    Object.assign(window, {player}) // for testing

    function play() {
        player.autoplay = true
        player.play()
    }

    function pause() {
        player.autoplay = false
        player.pause()
    }

    async function setSong(song) {
        if (!settingSong) {
            console.log(`play ${song.getTitle()}`)
            settingSong = true;
            try {
                let res = await song.getSource()
                currentSong = song
                player.src = res
                play()
                dispatch('playing')
                return true
            } catch (e) {
                console.error("setSong() failed");
                console.error(e.message);
                throw e
            } finally {
                settingSong = false
            }
        }
        return false
    }

    function getInfo() {
        return {
            currentSong,
            currentPlaylist,
            history,
            queue,
            repeat,
            volume: unModdedVol,
            paused: player.paused || player.ended,
            time: player.currentTime,
        }
    }

    player.addEventListener('timeupdate', e=>{
        dispatch('songtime')
    })

    function songEnded(depth = 0) {
        if (depth > 10) {
            console.trace()
            throw new Error("songEnded recursion more than 10 times! has something gone wrong???")
        }
        if (!settingSong) {
            if (currentPlaylist) {
                while (queue.length < 50 && queue.length < Math.ceil(currentPlaylist.getLength()/2)) {
                    let randomSong = currentPlaylist.getRandomFilteredSong(queue);
                    if (randomSong) {
                        queue.push(randomSong)
                    } else {
                        console.error("QUEUE FAILED!?!?!?!?")
                        break
                    }
                }
            }
            if (queue.length > 0) {
                let nextSong = queue.shift();
                if (currentSong) {
                    history.push(currentSong)
                }
                setSong(nextSong).then(res => {
                    if (!res) {
                        songEnded(depth + 1)
                    }
                }).catch (e => {
                    songEnded(depth + 1)
                })

                dispatch('playing')
            }
        }
    }

    player.addEventListener('ended', e=>{
        if (repeat) {
            player.play()
        } else {
            songEnded()
        }
    })

    function dispatchPlaying() {
        dispatch('playing')
    }

    player.onplay = dispatchPlaying
    player.onplaying = dispatchPlaying
    player.onseeked = dispatchPlaying
    player.onstalled = dispatchPlaying
    player.onpause = dispatchPlaying


    return {
        getInfo,
        pause,
        play,

        togglePlaying() {
            if (player.paused) {
                play()
            } else {
                pause()
            }
        },

        forceSetSong(song) {
            queue.unshift(song)
            songEnded()
        },

        setSongFromUrl(urlStream) {
            currentSong = undefined
            player.src = urlStream
            play()
        },

        setPlaylist(playlist) {
            currentPlaylist = playlist
            queue = []
            songEnded()
            history = []
            dispatch('playing')
        },

        getTime() {
            return player.currentTime
        },

        setTime(seconds) {
            player.play() // In case the song has ended and playback has stopped.
            player.currentTime = seconds
            return player.currentTime
        },

        setVolume(volume) {
            if (volume < 0) volume = 0
            if (volume > 1) volume = 1
            unModdedVol = volume
            player.volume = unModdedVol ** volMod
            localStorage.volume = volume
            dispatch('playing')
        },

        forward() {
            songEnded()
        },

        back() {
            let nextSong = history.pop()
            if (nextSong) {
                queue.unshift(currentSong)
                setSong(nextSong).finally(() => {
                    dispatch('playing')
                })
            }
        },
        
        setRepeat(bool) {
            repeat = bool
        }
    }
}

export default MusicPlayer