import {placeholderURL, extractId} from '../../util.js'
import {dispatch} from "../event.js";
import {apiSong} from "../types";

function forceRedraw() {
    dispatch('song')
    dispatch('playlist')
}

export default function Song(info: apiSong) {
    let id = info.id
    let title = info.title
    let extractor = info.extractor
    if (extractor === "youtube") {
        webpageUrl = `https://www.youtube.com/watch?v=${vidId}`
    }

    uuid = uuid || api.getUUID()

    let cachedThumb;
    let cachedSong;

    return {
        // Returns string title
        getTitle() {
            return title
        },

        // Returns string artist
        getArtist() {
            return artist
        },
        // Returns string uuid
        getUUID() {
            return uuid
        },
        // Returns string album
        getAlbum() {
            return album
        },

        // Returns localurl or the remoteurl if local does not exist.
        getURL() {
            switch (extractor) {
                case "youtube":
                    return `youtube.com/watch?v=${vidId}`
                case "Bandcamp":
                    return webpageUrl
                default:
                    throw new Error(`Unsupported extractor: ${extractor}`)
            }
        },

        isDisabled() {
            return disabled
        },

        async getSource() {
            let source;
            if (cachedSong && false){ // Needs more testing but if using remote urls, the source could have changed since last time
                console.log(`Fetched from cache: ${title}`)
                source = cachedSong
            } else {
                console.group(title)
                console.log(`Fetching `);

                let path = await api.getSongPath(uuid)
                if (path) {
                    console.log("fetching from cached path");
                    source = cachedSong = path
                } else {
                    try {
                        // Waiting for the song to download before streaming it creates more delay than just streaming
                        // fromt the remote
                        api.downloadSong(uuid, webpageUrl)
                        source = await api.getRemoteSongStream(webpageUrl)
                        if (typeof source === "object") {
                            let msg = source?.message
                            source = ""
                            if (msg.includes('ERROR: Video unavailable')){
                                disabled = true
                            }
                            throw new Error(msg)
                        }
                    } catch (e) {
                        console.log("Fetch failed");
                        console.log(e)
                    }
                }
                console.log(`Fetched `)
                console.groupEnd()

            }
            if (source) {
                return source
            } else {
                forceRedraw(true)
                throw new Error("Song has no available source.")
            }
        },

        // Returns length of song in seconds
        getDurationSeconds() {
            return parseInt(duration)
        },

        // Returns a url to the thumbnail, downloading it locally if it doesn't exist, or falling back to the remote
        // url and lastly the placeholder url
        async getThumb() {
            let thumb = await api.fetchThumbnail(uuid, remoteThumb)
            return cachedThumb = (thumb || placeholderURL)
        },

        // Only returns local url if it exists. Used to avoid unnecessary async calls
        getCachedThumb() {
            return cachedThumb || false
        },

        // Used by JSON.stringify
        toJSON() {
            return ['song', title, vidId, extractor, duration, artist, album, remoteThumb, uuid, disabled, webpageUrl]
        }
    }
}
