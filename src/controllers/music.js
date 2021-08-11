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

    Object.assign(window, {player}) // for testing

    function play() {
        player.autoplay = true
        player.play()
    }

    function pause() {
        player.autoplay = false
        player.pause()
    }

    function setSong(song) {
        if (!settingSong) {
            console.log(`play ${song.getTitle()}`)
            settingSong = true;
            song.getSource().then(res => {
                currentSong = song
                player.src = res
                play()
                dispatch('playing')
                return true
            }).catch(e => {
                console.error("setSong() failed");
                console.error(e.message);
                return false
            }).finally(()=>settingSong = false)
        }
    }

    function getInfo() {
        return {
            currentSong,
            currentPlaylist,
            history,
            queue,
            repeat,
            paused: player.paused || player.ended,
            time: player.currentTime,
            volume: player.volume,
        }
    }

    player.addEventListener('timeupdate', e=>{
        dispatch('songtime')
    })

    function songEnded() {
        if (currentPlaylist && !settingSong) {
            while (queue.length < 50 && queue.length < Math.ceil(currentPlaylist.getLength()/2)) {
                let randomSong = currentPlaylist.getRandomFilteredSong(queue);
                if (randomSong) {
                    queue.push(randomSong)
                } else {
                    console.error("QUEUE FAILED!?!?!?!?")
                    break
                }
            }
            let nextSong = queue.shift();
            setSong(nextSong)
            if (currentSong) {
                history.unshift(currentSong)
            }
            dispatch('playing')
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
            currentPlaylist = undefined;
            setSong(song)
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
            player.volume = volume
            localStorage.volume = volume
            dispatch('playing')
        },

        forward() {
            songEnded()
        },

        back() {
            let nextSong = history.shift()
            if (nextSong) {
                queue.unshift(currentSong)
                setSong(nextSong)
            }
        },
        
        setRepeat(bool) {
            repeat = bool
        }
    }
}

export default MusicPlayer