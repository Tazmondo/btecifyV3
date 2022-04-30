const url = "127.0.0.1:8000"
const serverAddress = "http://"+url
const webSocketAddress = "ws://"+url

type Song = {
    title: string
    album?: string
    duration?: number
    extractor?: string
    weburl: string
    artist?: string
}

type Playlist = {
    title: string,
    songs: Song[]
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

type ProgressCallbackFunction = (progress: number) => void;

export async function fullSync(playlists: {playlists: Playlist[]}, progressCallback: ProgressCallbackFunction) {
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
                console.log(event.data)
                webSocket.send("Send me more!")
            }
            webSocket.onclose = (event) => {
                switch (event.code) {
                    case 3006:
                        console.log("Job id was invalid");
                        return false
                    case 3005:
                        console.log("Job completed successfully");
                        return true
                    default:
                        console.log(`Job failed, code: ${event.code}`);
                }
            }


        } else {
            return false
        }

        return true
    } else {
        return false
    }
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

    await fullSync(syncdata, (progress) => {})

}

// test()
