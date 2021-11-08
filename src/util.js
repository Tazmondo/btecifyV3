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

export function isSongInSongArray (songArray, song) {
    return songArray.some(v => {return v.getUUID() === song.getUUID()})
}

export function durationSecondsToMinutes(iSeconds) {
    let minutes = Math.floor(iSeconds/60)
    let seconds = iSeconds % 60
    if (seconds < 10) {
        seconds = `0${seconds}`
    }
    if (minutes < 10) {
        minutes = `0${minutes}`
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
    page.classList.toggle("switching", true)
    // page.classList.toggle("hidden",false)
    page.dataset.exit = "false"

    requestAnimationFrame(() => {
        page.classList.toggle("hidden",false)
    }) // Without this delay, the animation is sometimes skipped.

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
            page.remove()
        } else if (page.dataset.exit === "true") {
            page.classList.toggle("switching", false)
        }
    }, 800) // Transition length + a bit
}

// Checks if one element is a descendant of another.
export function isDescended(child, parent) {
    let element = child;
    while ((element = element.parentElement)) {
        if (element === parent) {
            return true
        }
    }
    return child === parent
}

/**
 * Makes an element draggable.
 * @param dragger {HTMLElement|Node}
 * @param container {HTMLElement|Node}
 */
export function makeDraggable(dragger, container) {

    let rect = container.getBoundingClientRect()

    let left = rect.x
    let top = rect.y

    function updateContainerPosition() {
        let constrainedLeft, constrainedTop
        ({left: constrainedLeft, top: constrainedTop} = constrain(left, top))

        container.style.left = `${constrainedLeft}px`
        container.style.top = `${constrainedTop}px`
    }

    function constrain(left, top) {
        let maxLeft = window.innerWidth - container.clientWidth;
        let maxTop = window.innerHeight - container.clientHeight

        if (left < 0) left = 0
        else if (left > maxLeft) left = maxLeft

        if (top < 0) top = 0
        else if (top > maxTop) top = maxTop

        return {left, top}
    }

    container.style.position = "fixed"
    updateContainerPosition()

    dragger.addEventListener('mousedown', e => {
        function moved(e) {
            left += e.movementX
            top += e.movementY

            updateContainerPosition()
        }
        window.addEventListener('mousemove', moved)

        window.addEventListener('mouseup', e => {
            ({left, top} = constrain(left, top))
            window.removeEventListener('mousemove', moved)
        }, {once: true})
    })
}
