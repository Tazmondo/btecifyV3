import Playlist, {PlaylistInterface} from "./objects/playlist.js";
import {copyArray, randomIndex} from "../util.js";
import {dispatch} from "./event.js";
import * as serverApi from './api.js'
import {postSong, putPlaylist} from './api.js'
import {apiPlaylistShallow, playlistSong, songBase, songIn} from "./types.js";


// let parsers = {
//     'song': argArray => {
//         if (flag < 1) {
//             argArray[1] = extractId(argArray[1])
//             argArray.splice(2, 0, 'youtube')
//         }
//
//         return Song(...argArray)
//     },
//
//     'playlist': argArray => {
//         return Playlist(...argArray)
//     }
// }
//
// function parseObject(k, v) {
//     if (Array.isArray(v)) {
//         let objName = v[0]
//         if (parsers[objName] !== undefined) {
//             return parsers[objName](v.slice(1))
//         }
//     }
//     return v
// }

// let allSongPlaylist = (() => {
//     if (localStorage['song'] !== undefined) {
//         try {
//             return JSON.parse(localStorage['song'], parseObject)
//
//         } catch (e) {
//             console.log(e.message);
//         }
//     }
//     console.log("Making new song array");
//     return Playlist("Songs")
// })()

let allSongs: songBase[]
try {
    allSongs = await serverApi.getSongs()
} catch (e) {
    allSongs = []
}

let shallowPlaylistArray: apiPlaylistShallow[];

try {
    shallowPlaylistArray = await serverApi.getShallowPlaylists()
} catch (e) {
    shallowPlaylistArray = []
}

if (shallowPlaylistArray === []) {
    console.error("SHALLOW PLAYLISTS RETURNED NULL!!!")
}
let fetchedDeepPlaylists = await serverApi.getDeepPlaylists()
let deepPlaylists: { [key: number]: PlaylistInterface } = fetchedDeepPlaylists.reduce(
    (obj: { [key: number]: PlaylistInterface }, val) => (
        {...obj, [val.id]: Playlist(val)}
    ),
    {}
)

// let playlistArray = (() => {
//     if (localStorage['playlist'] !== undefined) {
//         try {
//             return JSON.parse(localStorage['playlist'], parseObject)
//         } catch (e) {
//             console.log(e.message);
//         }
//     }
//     console.log("Making new playlist array");
//     return []
// })()

Object.assign(window, {allSongs, shallowPlaylistArray, deepPlaylists}) // For testing

async function getDeepPlaylist(playlistId: number): Promise<PlaylistInterface | null> {
    if (playlistId in deepPlaylists) {
        return deepPlaylists[playlistId]
    } else {
        let newApiPlaylist = await serverApi.getPlaylist(playlistId)
        if (newApiPlaylist !== null) {
            let playlist = Playlist(newApiPlaylist)
            deepPlaylists[playlistId] = playlist
            return playlist
        } else {
            throw Error("Could not get playlist.")
        }
    }
}

function isPlaylistTitleUsed(title: string) {
    let titleArray = shallowPlaylistArray.map(v => v.title);
    return titleArray.includes(title)
}

function getPlaylistIndex(playlistId: number): number {
    return shallowPlaylistArray.findIndex(v => v.id === playlistId)
}

function getUsedRemoteUrls(): { [p: string]: boolean } {
    return allSongs.reduce((obj, v) => ({...obj, [v.weburl]: true}), {})
}

function doesSongExist(songUrl: string) {
    let remotes = getUsedRemoteUrls()
    return songUrl in remotes
    // return false // todo: song name searching and stuff to check for potential duplicates
}

export function getSongFromId(id: number) {
    return allSongs.find(v => v.id === id)
}

/**
 * @throws {Error}
 */
export async function makePlaylist(title: string, songs?: number[]): Promise<PlaylistInterface> {
    if (!isPlaylistTitleUsed(title)) {
        let result = await serverApi.postPlaylist(title, songs)
        let newPlaylist = Playlist(result);
        deepPlaylists[newPlaylist.getId()] = newPlaylist
        dispatch('playlist')
        return newPlaylist
    } else {
        throw new Error("Playlist title already in use")
    }
}

export async function addToPlaylist(playlist: PlaylistInterface, song: songBase): Promise<boolean> {
    let songs = playlist.getSongIds()
    songs.push(song.id)
    try {
        let newPlaylist = await putPlaylist(playlist.getId(), playlist.getTitle(), songs)
        deepPlaylists[newPlaylist.id] = Playlist(newPlaylist)
        dispatch('playlist')
        return true
    } catch (e) {
        return false
    }
}

export async function removeFromPlaylist(playlist: PlaylistInterface, song: playlistSong): Promise<boolean> {
    let songs = playlist.getSongIds()
    songs = songs.filter(v => v !== song.id)

    try {
        let newPlaylist = await putPlaylist(playlist.getId(), playlist.getTitle(), songs)
        deepPlaylists[newPlaylist.id] = Playlist(newPlaylist)
        dispatch('playlist')
        return true
    } catch (e) {
        return false
    }
}

export async function renamePlaylist(playlist: PlaylistInterface, newName: string): Promise<boolean> {
    try {
        let newPlaylist = await putPlaylist(playlist.getId(), newName)
        deepPlaylists[newPlaylist.id] = Playlist(newPlaylist)
        dispatch('playlist')
        return true
    } catch (e) {
        return false
    }
}

export async function deletePlaylist(playlist: PlaylistInterface): Promise<boolean> {
    let res = await serverApi.deletePlaylist(playlist.getId())
    if (res) {
        delete deepPlaylists[playlist.getId()]
        shallowPlaylistArray.splice(getPlaylistIndex(playlist.getId()), 1)
        dispatch('playlist')
        return true
    }
    return false
}

/**
 * Register a song object with playlists.
 * @param song {Song}
 * @param playlists {[Playlist]}
 * @return boolean
 */
export async function makeSong(song: songIn, playlists: number[] = []) {
    if (!doesSongExist(song.weburl)) {
        let newSong = await postSong(song, playlists)
        allSongs.push(newSong)

        playlists.forEach(playlistId => {
            deepPlaylists[playlistId].addSong(newSong)
        })

        shallowPlaylistArray.forEach(v => {
            if (v.id in playlists) {
                v.songs.push(newSong.id)
            }
        })
        dispatch('song')
        return true
    }
    return false
}

export function deleteSong(song: songBase) {
    // todo: implement me
    // allSongs.removeSongWithSong(song)
    // playlistArray.forEach(playlist => playlist.removeSongWithSong(song))
    // dispatch('playlist')
    // dispatch('song')
}

export function deleteUnusedSongs() {
    // todo: implement me
    // let usedUUIDS = playlistArray.reduce((map, playlist) => {
    //     playlist.getSongs().reduce((map2, song) => {
    //         map2[song.getUUID()] = true
    //         return map2
    //     }, map)
    //     return map
    // }, {})
    // allSongs.getSongs().forEach(v => {
    //     if (usedUUIDS[v.getUUID()] !== true) {
    //         allSongs.removeSongWithSong(v)
    //     }
    // })
    // // console.log(unusedSongs.map(v => v.getTitle()));
    // dispatch('song')
    // dispatch('playlist')
}

// Returns a sorted array of playlists.
export function getPlaylistArray(): apiPlaylistShallow[] {
    return copyArray(shallowPlaylistArray).sort((a: apiPlaylistShallow, b: apiPlaylistShallow) => {
        return b.songs.length - a.songs.length
    })
}

export function getPlaylistFromTitle(title: string) {
    let playlistId = shallowPlaylistArray.find(v => v.title === title)?.id
    if (playlistId) {
        return deepPlaylists[playlistId]
    }
    return
}

export function getPlaylistsWithSong(song: number): number[] {
    return shallowPlaylistArray.filter(playlist => song in playlist.songs).map(v => v.id)
}

export function getSongPlaylist(): songBase[] {
    return allSongs
}

export function getRandomSong(): songBase {
    return allSongs[randomIndex(allSongs.length)]
}

// export function setData(songPlaylist, iPlaylistArray) {
//     allSongs = songPlaylist
//     playlistArray = iPlaylistArray
// }

function urlFromResponse(responseData: { extractor: string; id: string; webpage_url: string; }): string {
    switch (responseData.extractor) {
        case "youtube":
            return `youtube.com/watch?v=${responseData.id}`

        case "Bandcamp":
            return responseData.webpage_url
    }
    throw new Error("Unknown extractor " + responseData?.extractor)
}

export async function makeRemotePlaylist(playlistName: string, playlistURL: string) {
    if (!isPlaylistTitleUsed(playlistName)) {
        // @ts-ignore
        let remotePlaylist = await api.getShallowPlaylist(playlistURL)
        if (remotePlaylist?.entries) {
            let remotes = getUsedRemoteUrls()
            let duplicates: { [weburl: string]: songIn } = {}
            console.log(remotePlaylist, remotePlaylist.entries)
            let songs = Array.from(remotePlaylist.entries.map((v: { track?: any; title?: any; artist?: any; album?: any; extractor: any; id: any; webpage_url: any; }) => {
                let newUrl = urlFromResponse(v)
                if (duplicates[newUrl] !== undefined) {
                    return false
                }
                if (!(newUrl in remotes)) {
                    let title = v.track || v.title
                    // let newSong = Song(title, v.id, v.extractor, v.duration, v.uploader, v?.album, v?.thumbnail, undefined, undefined, newUrl)
                    let newSong: songIn = {
                        title,
                        weburl: newUrl,
                        artist: v?.artist,
                        album: v?.album
                    }

                    // allSongs.push(newSong)
                    remotes[newUrl] = true
                    duplicates[newUrl] = newSong
                    return newSong
                } else {
                    return duplicates[newUrl]
                }
            }).filter((v: boolean) => v))

            let ids: number[] = []
            for (let song of songs) {
                let res = await serverApi.postSong(song as songIn)
                ids.push(res.id)
                allSongs.push(res)
            }

            let newPlaylist = Playlist(await serverApi.postPlaylist(playlistName, ids))
            deepPlaylists[newPlaylist.getId()] = newPlaylist
            dispatch('playlist')
            return newPlaylist
        }
    }
}
