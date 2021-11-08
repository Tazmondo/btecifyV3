console.log("controller.js running...")

// IMPORTING AND SETTING UP

import {Playlist} from "./controllers/objects/playlist.js";
import {Song} from './controllers/objects/song.js'
import {copyArray, durationMinutesToSeconds, extractId} from "./util.js";
import * as EventController from './controllers/event.js'
import * as ObjectController from './controllers/object.js'
import * as MusicController from './controllers/music.js'
import * as RouteController from './controllers/route.js'
import * as ClipboardController from './controllers/clipboard.js'

export const CURFLAG = 1

export function saveData() {
    localStorage["playlist"] = JSON.stringify(ObjectController.getPlaylistArray())
    localStorage["song"] = JSON.stringify(ObjectController.getSongPlaylist())
    localStorage['flag'] = CURFLAG
}

// CONTROLLER IMPORTS


import './controllers/context-menu.js'
import './controllers/hotkey.js'
import './controllers/search.js'

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
        e: () => ObjectController.getSongPlaylist()
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
// function readInputData() {
//     let inputData = api.getInputData()
//     let songs = []
//     for (let playlist of inputData) {
//         for (let song of playlist.songs) {
//             if (!songs.find(v => {
//                 return v.getURL() === song.songurl
//             })) {
//                 let duration = durationMinutesToSeconds(song.duration)
//
//                 if (isNaN(duration)) {
//                     throw "NaN duration"
//                 }
//                 let thumb = song.thumbnail.replace("hqdefault.jpg", "maxresdefault.jpg")
//                 thumb = thumb.replace("sddefault.jpg", "maxresdefault.jpg")
//                 let newSong = Song(ObjectController.updatedSongCallback, song.songname, song.songurl, "youtube", duration, song.author, "", thumb)
//                 songs.push(newSong)
//             }
//         }
//     }
//
//     let playlists = []
//
//     for (let playlist of inputData) {
//         if (playlist.playlistname !== "empty"){
//
//             let newPlaylist = Playlist(ObjectController.updatedPlaylistCallback, playlist.playlistname, songs.filter(v => {
//                 return playlist.songs.find(v2 => {
//                     return v.getURL() === v2.songurl
//                 })
//             }))
//             playlists.push(newPlaylist)
//         }
//     }
//
//
//     let newPlaylist = Playlist(ObjectController.updatedPlaylistCallback, "Songs", songs);
//     ObjectController.setData(newPlaylist, playlists)
//     localStorage['song'] = JSON.stringify(ObjectController.getSongPlaylist())
//     localStorage['playlist'] = JSON.stringify(ObjectController.getPlaylistArray())
//     EventController.dispatch('playlist')
//     EventController.dispatch('song')
//
// }
// readInputData()

api.removeUnusedDownloads(ObjectController.getSongPlaylist().getSongs().map(v => {return v.getUUID()}))
// todo: uncomment me


