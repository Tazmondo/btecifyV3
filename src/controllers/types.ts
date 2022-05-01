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

export type apiPlaylistShallow = {
    id: number
    title: string
    songs: number[]
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
    title: string
    weburl: string
    playlists: songPlaylist[]
    duration?: number
    extractor?: string
    album?: albumBase
    artist?: artistBase
}

export interface apiSong extends songBase {
    dateadded: string
}


export interface apiPlaylistDeep extends playlistBase {
    songs: apiSong[]
}

export interface songIn {
    weburl: string
    title?: string
    album?: string
    artist?: string
}
