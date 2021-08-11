console.log("utils.js running")

export const placeholderURL = "./assets/thumbplaceholder.png"

export function validSong(song) {
    return Boolean(song?.getUUID && song?.getTitle && song?.getURL)
}

export function copyArray(array) {
    if (Array.isArray(array)) {
        return array.slice(0)
    }
}

export function durationSecondsToMinutes(iSeconds) {
    let minutes = Math.floor(iSeconds/60)
    let seconds = iSeconds % 60
    if (seconds < 10) {
        seconds = `0${seconds}`
    }
    return `${minutes}:${seconds}`
}

export function durationMinutesToSeconds(iMinutes) {
    let duration = 0;
    if (iMinutes.length === 8) {
        duration = (Number(iMinutes.substr(3, 2)) * 60) + Number(iMinutes.substr(6, 2))
    } else if (iMinutes.length === 5) {
        duration = (Number(iMinutes.substr(0, 2)) * 60) + Number(iMinutes.substr(3, 2))
    } else {
        throw new Error(`Invalid duration was passed ${iMinutes}`)
    }

    return duration
}

export function randomIndex(maxIndex) {
    return (Math.floor(Math.random() * maxIndex) + 1) - 1
}

export function pageEntry(page) {
    console.log("entering", page)
    page.classList.toggle("switching", true)
    // page.classList.toggle("hidden",false)
    page.dataset.exit = "false"

    setTimeout(() => {
        page.classList.toggle("hidden",false)
    }, 1) // Without this delay, the animation is sometimes skipped.

    setTimeout(() => {
        if (page.dataset.exit === "false") {
            page.classList.toggle("switching", false)
        }
    }, 800) // Transition length + a bit
}

export function pageExit(page, remove=false) {
    page.dataset.exit = "true"
    page.classList.toggle("switching", true)
    page.classList.toggle("hidden", true)
    setTimeout(() => {
        if (remove) {
            console.log("Deleting", page)
            page.remove()
        } else if (page.dataset.exit === "true") {
            page.classList.toggle("switching", false)
        }
    }, 800) // Transition length + a bit
}


export function generateSongElement(song, playlist, superSub, otherPlaylist, isRightSide) {
    let newSongItemContainer = document.createElement('div')
    newSongItemContainer.classList.toggle("song-list-item-container")
    if (superSub) {
        newSongItemContainer.classList.toggle('super')
    }

    let template = document.querySelector('#song-list-item-template')

    new IntersectionObserver((entries, observer) => {
        entries.forEach( entry => {
            if (entry.target.classList.contains('song-list-item-container')) {
                if (entry.isIntersecting) {
                    if (!newSongItemContainer.classList.contains('seen')) {
                        newSongItemContainer.classList.toggle("seen")
                        populateSongItem()
                    }
                } else {
                    if (newSongItemContainer.classList.contains('seen')) {
                        depopulateSongItem()
                        newSongItemContainer.classList.toggle("seen")
                    }
                }
            }
        })
    }).observe(newSongItemContainer)

    function depopulateSongItem() {
        Array.from(newSongItemContainer.children).forEach(element => {  // Use Array.from since .children returns a live list
            element.remove()
        })
    }

    function populateSongItem() {
        let newSongItem = template.content.firstElementChild.cloneNode(true)
        newSongItem.classList.toggle('enabled', !song.isDisabled())

        let thumb = newSongItem.querySelector('.thumb')
        let title = newSongItem.querySelector('.title')
        let artist = newSongItem.querySelector('.artist')
        let album = newSongItem.querySelector('.album')
        let duration = newSongItem.querySelector('.duration')

        let removeButton = newSongItem.querySelector('.playlist-page-remove-from-playlist')


        title.innerText = song.getTitle()
        title.title = song.getTitle()
        artist.innerText = song.getArtist()
        album.innerText = song.getAlbum()
        duration.innerText = durationSecondsToMinutes(song.getDurationSeconds())

        if (playlist) {
            removeButton.querySelector('title').textContent = `Remove from ${playlist.getTitle()}`
            removeButton.addEventListener('click', e => {
                removeFromPlaylist(playlist, song)
            })
        }

        if (superSub) {
            newSongItem.classList.toggle("super")

            let addButtonEast = newSongItem.querySelector('.playlist-page-add-to-playlist-east')
            let addButtonWest = newSongItem.querySelector('.playlist-page-add-to-playlist-west')
            let addButton;

            if (isRightSide) {
                addButtonWest.classList.toggle("inactive")
                addButton = addButtonWest
            } else {
                addButtonEast.classList.toggle("inactive")
                addButton = addButtonEast
            }

            addButton.querySelector('title').textContent = `Add to ${otherPlaylist.getTitle()}`
            addButton.addEventListener('click', e => {
                addToPlaylist(otherPlaylist, song)
            })
        }

        let cachedThumb = song.getCachedThumb()
        if (cachedThumb) {
            thumb.style.backgroundImage = `url(${cachedThumb})`
        } else {
            song.getThumb().then(res => {
                thumb.style.backgroundImage = `url(${res})`
            })
        }


        if (!song.isDisabled()) {
            newSongItem.addEventListener('dblclick', e => {
                console.log(`Request play ${song.getTitle()}`);
                forceSetSong(song)
            })
        }

        newSongItemContainer.insertAdjacentElement('afterbegin', newSongItem)
    }

    return newSongItemContainer
}
