console.log("controller.js running...")

// IMPORTING AND SETTING UP

import * as EventController from './controllers/event.js'
import * as ObjectController from './controllers/object.js'
import * as MusicController from './controllers/music.js'
import * as RouteController from './controllers/route.js'
import * as ClipboardController from './controllers/clipboard.js'

// export function saveData() {
//     localStorage["playlist"] = JSON.stringify(ObjectController.getPlaylistArray())
//     localStorage["song"] = JSON.stringify(ObjectController.getSongPlaylist())
//     localStorage['flag'] = CURFLAG
// }
// CONTROLLER IMPORTS
import './controllers/context-menu.js'
import './controllers/hotkey.js'
import './controllers/search.js'
import './controllers/api.js'


// PAGE IMPORTS
import navInit from './headerNav.js'

import footerPlayerInit from './footerPlayer.js'


const events = {
    'save': {
        callbacks: [],
        e: () => true
    },
    'playlist': {
        callbacks: [],
        e: () => ObjectController.getPlaylistArray()
    },
    'song': {
        callbacks: [],
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

// EventController.dispatchAll()
