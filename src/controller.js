console.log("controller.js running...")

// IMPORTING AND SETTING UP

import {Playlist, Song} from "./objects.js";
import {copyArray, durationMinutesToSeconds} from "./util.js";


// CONTROLLER IMPORTS

import InitEventController from './eventController.js'
const EventController = InitEventController()

import InitObjectController from './objectController.js'
const ObjectController = InitObjectController(EventController.dispatch)

import InitMusicController from './musicController.js'
const MusicController = InitMusicController(EventController.dispatch)

export {EventController, ObjectController, MusicController}


// PAGE IMPORTS

import router from './headerNav.js'

import footerPlayerInit from './footerPlayer.js'

import homePageInit from './homePage.js'
import playlistPageInit from './playlistPage.js'

function saveData() {
    localStorage['playlist'] = JSON.stringify(ObjectController.playlistArray)
    localStorage['song'] = JSON.stringify(ObjectController.allSongPlaylist)
}

const events = {
    'playlist': {
        callbacks: [saveData],
        e: () => {return copyArray(ObjectController.playlistArray)}
    },
    'song': {
        callbacks: [saveData],
        e: () => {return copyArray(ObjectController.allSongPlaylist)}
    },
    'playing': {
        callbacks: [],
        e: () => {return MusicController.getInfo()}
    },
    'songtime': {
        callbacks: [],
        e: () => {return MusicController.getTime()}
    }
}

for (let eventName in events) {
    EventController.setupEvent(eventName, events[eventName].callbacks, events[eventName].e)
}

router().routeWithPageName('home')

footerPlayerInit()
homePageInit()
playlistPageInit()




// FOR DEBUGGING
// Object.assign(window, {EventController.dispatch, makePlaylist, doesPlaylistExist})
function readInputData() {
    let inputData = api.getInputData()
    let songs = []
    console.log(inputData)
    for (let playlist of inputData) {
        for (let song of playlist.songs) {
            if (!songs.find(v => {
                return v.getURL() === song.songurl
            })) {
                let duration = durationMinutesToSeconds(song.duration)

                if (isNaN(duration)) {
                    throw "NaN duration"
                }
                let thumb = song.thumbnail.replace("hqdefault.jpg", "maxresdefault.jpg")
                thumb = thumb.replace("sddefault.jpg", "maxresdefault.jpg")
                let newSong = Song(song.songname, [song.songurl], duration, song.author, "", [thumb])
                songs.push(newSong)
            }
        }
    }
    console.log(songs)

    let playlists = []

    for (let playlist of inputData) {
        if (playlist.playlistname !== "empty"){

            let newPlaylist = Playlist(playlist.playlistname, songs.filter(v => {
                return playlist.songs.find(v2 => {
                    return v.getURL() === v2.songurl
                })
            }))
            playlists.push(newPlaylist)
        }
    }

    console.log(playlists)

    ObjectController.allSongPlaylist = Playlist("Songs", songs);
    ObjectController.playlistArray = playlists;
    localStorage['song'] = JSON.stringify(ObjectController.allSongPlaylist)
    localStorage['playlist'] = JSON.stringify(ObjectController.playlistArray)
    EventController.dispatch('playlist')
    EventController.dispatch('song')

}
//readInputData()

api.removeUnusedDownloads(ObjectController.allSongPlaylist.getSongs().map(v => {return v.getUUID()}))


