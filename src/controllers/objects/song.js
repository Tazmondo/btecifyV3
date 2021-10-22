import {placeholderURL} from '../../util.js'

export function Song(updatedCallback, title, remoteUrl, duration, artist = "", album = "", remoteThumb = "", uuid = "", disabled=false) {
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
            return remoteUrl;
        },

        isDisabled() {
            return disabled
        },

        async getSource() {
            let source;
            if (cachedSong){
                console.log(`Fetched from cache: ${title}`)
                source = cachedSong
            } else {
                console.group(title)
                console.log(`Fetching `);

                let path = await api.getSongPath(uuid)
                if (path) {
                    source = cachedSong = path
                } else {
                    try {
                        api.downloadSong(uuid, remoteUrl)
                        source = await api.getRemoteSongStream(remoteUrl) || ""
                    } catch (e) {

                    }
                }
                console.log(`Fetched `)
                console.groupEnd()

            }
            if (source) {
                updatedCallback(false)
                return source
            } else {
                // commented as it could fail for reasons other than being unavailable
                // todo: check whether song is actually unavailable or whether there were connection issues etc
                // disabled = true
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
            return ['song', title, remoteUrl, duration, artist, album, remoteThumb, uuid, disabled]
        }
    }
}