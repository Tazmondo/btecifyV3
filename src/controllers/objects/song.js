import {placeholderURL} from '../../util.js'

export function Song(updatedCallback, title, urls, duration, artist = "", album = "", thumbnails = [], uuid = "", disabled=false) {
    if (urls.length === 0 || urls.length > 2) {
        throw new Error(`Number of song urls is ${urls.length}`)
    }
    if (thumbnails.length > 2) {
        throw new Error(`Number of thumbnails is ${urls.thumbnails}`)
    }

    uuid = uuid || api.getUUID()

    let localUrl = "";
    let remoteUrl = "";

    let localThumb = "";
    let remoteThumb = "";

    let cachedThumb;

    urls.forEach(url => {
        if (url.startsWith('http://') || url.startsWith('https://') || url.includes("www.")) {
            remoteUrl = url
        } else { // todo: actually add a check for file music
            localUrl = url
        }
    })

    thumbnails.forEach(thumbnail => {
        if (thumbnail.startsWith('http://') || thumbnail.startsWith('https://') || thumbnail.includes("www.") ) {
            remoteThumb = thumbnail
        } else { // todo: actually add a check for file thumb
            localThumb = thumbnail
        }
    })

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
            return localUrl || remoteUrl;
        },

        isDisabled() {
            return disabled
        },

        async getSource() {
            console.group(title)
            console.log(`Fetching `);
            let source = await api.fetchSong(uuid, remoteUrl) || ""
            console.log(`Fetched `)
            console.groupEnd()
            if (source) {
                updatedCallback(false)
                return source
            } else {
                disabled = true
                updatedCallback(true)
                throw new Error("Song has no available source. Will become disabled.")
            }
        },

        getVideoId() {
            return remoteUrl.substr(remoteUrl.length-11, 11)
        },

        // Returns length of song in seconds
        getDurationSeconds() {
            return duration
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
            return ['song', title, [remoteUrl, localUrl], duration, artist, album, [remoteThumb, localThumb], uuid, disabled]
        }
    }
}