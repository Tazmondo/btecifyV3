const url = "127.0.0.1:8000"
const serverAddress = "http://" + url
const webSocketAddress = "ws://" + url

type fullsyncSong = {
    title: string
    album?: string
    duration?: number
    extractor?: string
    weburl: string
    artist?: string
}

type fullsyncPlaylist = {
    title: string,
    songs: fullsyncSong[]
}

async function post(endpoint: String, data: any = null) {
    return await fetch(serverAddress + endpoint, {
        method: "post",
        mode: "cors",
        body: data ? JSON.stringify(data) : "",
        headers: {
            'Content-Type': "application/json"
        }
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
            }
        ]
    }

    await fullSync(syncdata, (progress, total, done) => console.log(progress, total, done))
    console.log("Done!")
}

test()
