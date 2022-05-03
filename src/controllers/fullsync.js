let address = "localhost:8000"

let serverAddress = "http://" + address
let wsAddress = "ws://" + address

/**
 * Takes a list of playlists, converts them to correct json format, and sends them to the server
 * @param playlists {Playlist[]}
 * @param progressCallback {Function?}
 * @returns {Promise<void>}
 */
export async function fullSync(playlists, progressCallback) {
    progressCallback = progressCallback ?? function (a, b, c) {
        console.log(a, b, c)
    }

    return new Promise(async (resolve, reject) => {
        try {
            let data = {
                'playlists': []
            }

            // playlists = [playlists.at(-1)]  // For testing

            playlists.forEach(playlist => {
                data['playlists'].push({
                    title: playlist.getTitle(),
                    songs: playlist.getSongs().map(song => {
                        return {
                            title: song.getTitle(),
                            album: song.getAlbum() === "" ? undefined : song.getAlbum(),
                            artist: song.getArtist() === "" ? undefined : song.getArtist(),
                            duration: song.getDurationSeconds(),
                            extractor: song.getExtractor(),
                            weburl: song.getURL(),
                        }
                    })
                })
            })
            let jsoned = JSON.stringify(data)
            console.log(jsoned);

            let res = await fetch(serverAddress + "/fullsync", {
                method: "post",
                body: jsoned,
                headers: {
                    'content-type': 'application/json'
                }
            })
            console.log(res);

            let res2 = await fetch(serverAddress + "/fulldownload", {
                method: "post"
            })

            if (res2.status === 200) {
                let jobId = await res2.json()
                let webSocket = new WebSocket(wsAddress + "/job/" + jobId)

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
            }
        } catch (e) {
            reject(e)
        }
    })

}
