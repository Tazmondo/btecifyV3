console.log("musicPlayer.js running")

function MusicPlayer() {
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
            currentSong = song
            player.src = song.getSource()
            play()
        },

        setPlaylist(playlist) {
            currentPlaylist = playlist
        },

        setCallback(event, callback) {
              player.addEventListener(event, (e) => {
                  callback(e, getInfo())
              })
        },
    }
}

export default MusicPlayer