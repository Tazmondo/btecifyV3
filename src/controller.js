console.log("controller.js running...")

// IMPORTING AND SETTING UP

import {Playlist} from "./controllers/objects/playlist.js";
import {Song} from './controllers/objects/song.js'
import {copyArray, durationMinutesToSeconds} from "./util.js";

const PLAYLISTSTORAGE = api.isDev ? "test-playlist" : "playlist"
const SONGSTORAGE = api.isDev ? "test-song" : "song"

function saveData() {
    localStorage[PLAYLISTSTORAGE] = JSON.stringify(ObjectController.getPlaylistArray())
    localStorage[SONGSTORAGE] = JSON.stringify(ObjectController.getAllSongs())
}

// CONTROLLER IMPORTS

import InitEventController from './controllers/event.js'
const EventController = InitEventController()

import InitObjectController from './controllers/object.js'
const ObjectController = InitObjectController(EventController.dispatch, saveData)

import InitMusicController from './controllers/music.js'
const MusicController = InitMusicController(EventController.dispatch, ObjectController.getRandomSong)

import InitRouteController from './controllers/route.js'
const RouteController = InitRouteController(EventController.dispatch)

import Initutil from './impureUtil.js'
const util = Initutil()

import InitClipboardController from './controllers/clipboard.js'
const ClipboardController = InitClipboardController(EventController.dispatch)

export {EventController, ObjectController, MusicController, RouteController, util, ClipboardController}

import InitHotkeyController from './controllers/hotkey.js'
const HotkeyController = InitHotkeyController(EventController.dispatch)

import InitContextMenuController from './controllers/context-menu.js'
const ContextMenuController = InitContextMenuController()

// PAGE IMPORTS

import navInit from './headerNav.js'

import footerPlayerInit from './footerPlayer.js'

import homePageInit from './pages/home.js'
import playlistPageInit from './pages/playlist.js'



const events = {
    'save': {
        callbacks: [saveData],
        e: () => true
    },
    'playlist': {
        callbacks: [saveData],
        e: () => ObjectController.getPlaylistArray()
    },
    'song': {
        callbacks: [saveData],
        e: () => ObjectController.getAllSongs()
    },
    'playing': {
        callbacks: [],
        e: () => MusicController.getInfo()
    },
    'songtime': {
        callbacks: [],
        e: () => MusicController.getTime()
    },
    'currentpage': {
        callbacks: [],
        e: () => RouteController.getCurrentRouteName()
    },
    'clipboard': {
        callbacks: [],
        e: () => ClipboardController.getClipboardData()
    }
}

for (let eventName in events) {
    EventController.setupEvent(eventName, events[eventName].callbacks, events[eventName].e)
}

RouteController.baseRoute('home')

navInit()
footerPlayerInit()


// FOR DEBUGGING
// Object.assign(window, {EventController.dispatch, makePlaylist, doesPlaylistExist})
function readInputData() {
    let inputData = api.getInputData()
    let songs = []
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
                let newSong = Song(ObjectController.updatedSongCallback, song.songname, song.songurl, duration, song.author, "", thumb)
                songs.push(newSong)
            }
        }
    }

    let playlists = []

    for (let playlist of inputData) {
        if (playlist.playlistname !== "empty"){

            let newPlaylist = Playlist(ObjectController.updatedPlaylistCallback, playlist.playlistname, songs.filter(v => {
                return playlist.songs.find(v2 => {
                    return v.getURL() === v2.songurl
                })
            }))
            playlists.push(newPlaylist)
        }
    }


    let newPlaylist = Playlist(ObjectController.updatedPlaylistCallback, "Songs", songs);
    ObjectController.setData(newPlaylist, playlists)
    localStorage['song'] = JSON.stringify(ObjectController.getAllSongs())
    localStorage['playlist'] = JSON.stringify(ObjectController.getPlaylistArray())
    localStorage['test-song'] = JSON.stringify(ObjectController.getAllSongs())
    localStorage['test-playlist'] = JSON.stringify(ObjectController.getPlaylistArray())
    EventController.dispatch('playlist')
    EventController.dispatch('song')

}
// readInputData()

api.removeUnusedDownloads(ObjectController.getAllSongs().getSongs().map(v => {return v.getUUID()}))
// todo: uncomment me


