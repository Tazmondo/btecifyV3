const url = "localhost:8000"
const serverAddress = "http://" + url
const webSocketAddress = "ws://" + url

import {apiPlaylistDeep, apiPlaylistShallow, fullsyncPlaylist, songBase, songIn} from './types.js'


function getUrl(endpoint: string) {
    return serverAddress + endpoint
}

async function get(endpoint: string) {
    return await fetch(getUrl(endpoint))
}

async function post(endpoint: String, data?: any) {
    return await fetch(serverAddress + endpoint, {
        method: "post",
        mode: "cors",
        body: data ? JSON.stringify(data) : "",
        headers: {
            'Content-Type': "application/json"
        }
    })
}

async function put(endpoint: String, data?: any) {
    return await fetch(serverAddress + endpoint, {
        method: "put",
        mode: "cors",
        body: data ? JSON.stringify(data) : "",
        headers: {
            'Content-Type': "application/json"
        }
    })
}

async function del(endpoint: String) {
        return await fetch(serverAddress + endpoint, {
        method: "delete",
        mode: "cors",
    })
}

type ProgressCallbackFunction = (progress: number, total: number, done: boolean) => void;

export async function fullSync(playlists: { playlists: fullsyncPlaylist[] }, progressCallback: ProgressCallbackFunction) {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await post("/fullsync", playlists)

            if (response.status === 200) {
                let response2 = await post('/fulldownload')

                if (response2.status == 200) {
                    let jobId = await response2.json()

                    let webSocket = new WebSocket(webSocketAddress + "/job/" + jobId)

                    webSocket.onopen = (event) => {
                        webSocket.send("Begin progress transmitting")
                    }
                    webSocket.onmessage = (event) => {
                        let data = JSON.parse(event.data)
                        progressCallback(data.progress, data.size, data.status)
                        webSocket.send("Send me more!")
                    }
                    webSocket.onclose = (event) => {
                        switch (event.code) {
                            case 3006:
                                console.log("Job id was invalid");
                                reject("Job id was invalid")
                                break
                            case 3005:
                                console.log("Job completed successfully");
                                resolve(true)
                                break
                            default:
                                console.log(`Job failed, code: ${event.code}`);
                                reject(`Job failed, code: ${event.code}`)
                        }
                    }

                } else {
                    reject("Status code of fulldownlaod was " + response2.status)
                }
            } else {
                reject("Status code of fullsync was " + response.status)
            }
        } catch (e) {
            reject(e)
        }
    })
}

/**
 * @throws {Error}
 */
export async function getShallowPlaylists(): Promise<apiPlaylistShallow[]> {
    let res = await get('/playlist')

    if (res.status == 200) {
        return await res.json()
    } else {
        throw new Error("Could not get playlists " + res.status)
    }
}

/**
 * @throws {Error}
 */
export async function getDeepPlaylists(): Promise<apiPlaylistDeep[]> {
    let res = await get('/playlist?shallow=false')

    if (res.status == 200) {
        return await res.json()
    } else {
        throw new Error("Could not get deep playlists " + res.status)
    }
}

/**
 * @throws {Error}
 */
export async function getPlaylist(playlistId: number): Promise<apiPlaylistDeep> {
    let res = await get('/playlist/' + playlistId)
    if (res.status == 200) {
        return await res.json()
    } else {
        throw new Error("Could not get playlist " + res.status)
    }
}


/**
 * Overwrites playlist's songs with the given input songs
 * @throws {Error}
 */
export async function putPlaylist(playlistId: number, title: string, newSongs?: number[]): Promise<apiPlaylistDeep> {
    let url = '/playlist/' + playlistId
    let body = {
        title: title,
        songs: newSongs
    }
    let res = await put(url, body)
    if (res.status == 200) {
        return res.json()
    } else {
        throw new Error("Could not put playlist " + res.status)
    }
}

/**
 * @throws {Error}
 */
export async function postPlaylist(title: string, songs?: number[]): Promise<apiPlaylistDeep> {
    let res = await post('/playlist', {title: title, songs: songs})
    if (res.status == 200) {
        return await res.json()
    } else {
        throw new Error("Could not post playlist " + res.status)
    }
}

export async function deletePlaylist(playlistId: number): Promise<boolean> {
    let res = await del("/playlist/"+playlistId)
    return res.status == 200
}

/**
 * @throws {Error}
 */
export async function getSongs(): Promise<songBase[]> {
    let res = await get('/song')
    if (res.status == 200) {
        return await res.json()
    } else {
        throw new Error("Could not get songs " + res.status)
    }
}

/**
 * @throws {Error}
 */
export async function getSong(songId: number): Promise<songBase> {
    let res = await get('/song/' + songId)
    if (res.status == 200) {
        return await res.json()
    } else {
        throw new Error("Could not get song " + res.status)
    }
}

/**
 * @throws {Error}
 */
export async function postSong(song: songIn, playlists: number[] = []): Promise<songBase> {
    let res = await post('/song', {song, playlists})
    if (res.status == 200) {
        return await res.json()
    } else {
        throw new Error("")
    }
}

export function getThumbUrl(songId: number): string {
    return serverAddress + "/song/" + songId + "/thumb"
}

export function getSrcUrl(songId: number): string {
    return serverAddress + "/song/" + songId + "/src"
}


// todo: ADD ENDPOINTS FOR DELETION

async function test() {
    let syncdata = {
        "playlists": [
            {
                "title": "a test playlist",
                "songs": [
                    {
                        "title": "test1",
                        "weburl": "https://www.youtube.com/watch?v=ntX9LYIc5Ak",
                        "artist": "artist1",
                        "album": "album1"
                    },
                    {
                        "title": "test2",
                        "weburl": "https://www.youtube.com/watch?v=ggHN5ZJ8jkU",
                        "artist": "artist1",
                        "album": "album1"
                    },
                    {
                        "title": "test3",
                        "weburl": "https://www.youtube.com/watch?v=BbbcvFJ55F4",
                        "artist": "artist1",
                        "album": "album2"
                    },
                    {
                        "title": "test4",
                        "weburl": "https://www.youtube.com/watch?v=l2tVzX0JVUc",
                        "artist:": "artist2"
                    }
                ]
            },
            {
                "title": "test playlist 2",
                "songs": []
            }
        ]
    }

    await fullSync(syncdata, (progress, total, done) => console.log(progress, total, done))

    console.log(await getPlaylist(2))
    console.log(await deletePlaylist(2))
    console.log(await getPlaylist(2))
    console.log(await getShallowPlaylists())

    console.log("Done!")
}

// test()
