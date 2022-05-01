export type fullsyncSong = {
    title: string
    album?: string
    duration?: number
    extractor?: string
    weburl: string
    artist?: string
}

export type fullsyncPlaylist = {
    title: string,
    songs: fullsyncSong[]
}

export interface albumBase {
    id: number
    title: string
}

export interface artistBase {
    id: number
    title: string
}

export interface playlistBase {
    id: number
    title: string
}

export interface songPlaylist extends playlistBase {
    dateadded: string
}

export interface songBase {
    id: number
    title: string
    weburl: string
    disabled: boolean
    playlists: songPlaylist[]
    duration: number | null
    extractor: string | null
    album: albumBase | null
    artist: artistBase | null
}

export interface playlistSong extends songBase {
    dateadded: string
}

export interface apiPlaylistShallow extends playlistBase{
    songs: number[]
}

export interface apiPlaylistDeep extends playlistBase {
    songs: playlistSong[]
}

export interface songIn {
    weburl: string
    title?: string
    album?: string
    artist?: string
}
