// todo: Song added dates
import {placeholderURL, randomIndex} from "../../util.js";
import {dispatch} from "../event.js";
import {apiPlaylistDeep, playlistSong, songBase} from '../types.js'
import * as api from '../api.js'


function forceRedraw() {
    dispatch('playlist')
}

export interface PlaylistInterface {
    getEnabledSongs(): playlistSong[];

    getId(): number;

    getTitle(): string;

    setTitle(newTitle: string): void;

    getSongs(): playlistSong[];

    getSongIds(): number[];

    getLength(): number;

    getRandomFilteredSong(filter: number[]): playlistSong | false;

    getThumb(): string;

    refreshThumb(): void;

    doesContainSong(songId: number): boolean;

    addSong(song: songBase): playlistSong;

    removeSongWithId(songId: number): boolean;

    getSuperSongs(songArray: number[]): playlistSong[];

    getSubSongs(songArray: playlistSong[]): playlistSong[];
}

export default function Playlist(info: apiPlaylistDeep): PlaylistInterface {
    let cachedThumb: number | undefined = undefined; // So that when using random thumbnail, it is consistent.
    let songs: { [key: number]: playlistSong } = {}

    for (let song of info.songs) {
        songs[song.id] = song
    }

    let title = info.title
    let id = info.id

    // Sorts song list in place by title.
    function sortedSongs(): playlistSong[] {
        return getSongArray().sort((a, b) => a.dateadded.localeCompare(b.dateadded))
    }

    // Removes a song from a playlist using its uuid. Boolean indicating success returned.
    function removeSong(id: number) {
        if (id in songs) {
            delete songs[id]
            return true
        } else {
            console.warn("Tried to remove from a playlist a song that it didn't contain.")
            return false
        }
    }

    // Returns array of songs that are not disabled.
    function getEnabledSongs(): playlistSong[] {
        return getSongArray().filter(value => !value.disabled)
    }

    function getSongArray(): playlistSong[] {
        return Object.values(songs)
    }

    return {
        getEnabledSongs,

        getId(): number {
            return id
        },

        // Returns string title.
        getTitle(): string {
            return title
        },

        // Sets a new title. Must only be called from object controller so it can validate that no other playlists
        // with the title exist.
        setTitle(newTitle: string) {
            title = newTitle
        },

        // Returns a copy of the song array.
        getSongs() {
            return sortedSongs()
        },

        getSongIds(): number[] {
            return Object.keys(songs).map(v => Number(v))  // Use number instead of parseint as its more performant and we know that they will be regular number keys
        },

        // Returns integer number of enabled songs in song playlist.
        getLength() {
            return getEnabledSongs().length
        },


        // Takes an array of songs, returning a random song that does not exist in the array.
        getRandomFilteredSong(filter: number[] = []): playlistSong | false {
            let possibleSongs = getEnabledSongs().filter(v => {
                return !filter.includes(v.id)
            })
            if (possibleSongs.length > 0) {
                return possibleSongs[randomIndex(possibleSongs.length)]
            }
            return false
        },

        // returns a thumbnail randomly chosen from songs in the playlist, and on subsequent calls, the one
        // returned from the first call.
        getThumb(): string {
            if (cachedThumb !== undefined) {
                return api.getThumbUrl(cachedThumb)
            } else {
                cachedThumb = getEnabledSongs()[randomIndex(this.getLength())].id || undefined
                return cachedThumb === undefined ? placeholderURL : api.getThumbUrl(cachedThumb)
            }
        },

        refreshThumb() {
            cachedThumb = undefined
            forceRedraw()
        },

        // Returns boolean indicating whether the playlist contains a certain song object.
        doesContainSong(songId: number): boolean {
            return songId in songs
        },

        // Add song object to songs. Return boolean indicating success.
        addSong(song: songBase): playlistSong {
            if (!this.doesContainSong(song.id)) {
                let newPlaylistSong: playlistSong = {...song, dateadded: new Date().toISOString()}
                songs[song.id] = newPlaylistSong
                forceRedraw()
                return newPlaylistSong
            } else {
                throw new Error("Song already in playlist.")
            }
        },

        // COMMENTED SINCE USING SONG IDS IS MUCH BETTER

        // Attempts to remove a song from songs using a song Object. Returns a boolean indicating success.
        // Throws an error if an invalid song Object is passed.
        // removeSongWithSong(song) {
        //     if (validSong(song)) {
        //         let uuid = song.getUUID()
        //         if (api.uuidIsValid(uuid)) {
        //             let result = removeSong(uuid);
        //             sortSongs()
        //             forceRedraw()
        //             return result
        //         }
        //     }
        //     throw `This should never be reached. removeSong called on an invalid song: ${song}`
        //     return false
        // },

        // Attempts to remove a song using a uuid. Returns a boolean indicating success.
        // Throws an error if given an invalid uuid.
        removeSongWithId(songId: number) {
            let result = removeSong(songId)
            forceRedraw()
            return result
        },

        // Take a song array and return all songs in the playlist that do not exist in the array.
        getSuperSongs(songArray: number[]) {
            let givenSongs = songArray.reduce((obj, key) => ({...obj, [key]: true}), {})

            return getSongArray().filter(v => !(v.id in givenSongs))
        },

        // Take a song array and return all songs in it that aren't in the playlist.
        getSubSongs(songArray: playlistSong[]) {
            return songArray.filter(v => !(v.id in songs))
        },
    }
}

async function test() {

}

test()
