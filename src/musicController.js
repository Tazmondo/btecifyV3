console.log("musicController.js running")

function MusicPlayer(dispatch) {
    let history = [];
    let currentSong;
    let currentPlaylist;
    let player = new Audio()
    player.autoplay = true
    player.volume = 0.1

    Object.assign(window, {player}) // for testing

    function play() {
        player.autoplay = true
        player.play()
    }

    function pause() {
        player.autoplay = false
        player.pause()
    }

    function getInfo() {
        return {
            currentSong,
            currentPlaylist,
            history,
            'paused': player.paused,
            'time': player.currentTime,
        }
    }

    player.addEventListener('timeupdate', e=>{
        dispatch('songtime')
    })

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

        setSong(song) {
            console.log(`play ${song.getTitle()}`)
            song.getSource().then(res => {
                currentSong = song
                player.src = res
                play()
                dispatch('playing')
            }).catch(e => {
                console.error("setSong() failed");
                console.error(e.message);
            })
        },

        setSongFromUrl(urlStream) {
            currentSong = undefined
            player.src = urlStream
            play()
        },

        setPlaylist(playlist) {
            currentPlaylist = playlist
        },

        getTime() {
            return player.currentTime
        },

        setTime(seconds) {
            player.play() // In case the song has ended and playback has stopped.
            player.currentTime = seconds
            return player.currentTime
        },
    }
}

export default MusicPlayer