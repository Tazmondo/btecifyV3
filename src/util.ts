import {playlistSong} from "./controllers/types";

console.log("utils.js running")


export const placeholderURL = "./assets/thumbplaceholder.png"

// Commented 01/5/22
// export function validSong(song) {
//     return Boolean(song?.getUUID && song?.getTitle && song?.getURL)
// }

export function copyArray(array: any[]): any[] {
    return array.slice(0)
}

export function isSongInSongArray(songArray: playlistSong[], song: playlistSong): boolean {
    return songArray.some(v => v.id === song.id)
}

export function durationSecondsToMinutes(iSeconds: number): string {
    let minutes = Math.floor(iSeconds/60)
    let seconds = Math.floor(iSeconds % 60)

    let stringSeconds = seconds.toString()
    let stringMinutes = minutes.toString()

    if (seconds < 10) {
        stringSeconds = `0${seconds}`
    }

    if (minutes < 10) {
        stringMinutes = `0${minutes}`
    }

    return `${stringMinutes}:${stringSeconds}`
}

export function durationMinutesToSeconds(iMinutes: string): number {
    let duration = 0;
    if (iMinutes.length === 8) {
        duration = (Number(iMinutes.substring(3, 5)) * 60) + Number(iMinutes.substring(6, 8))
    } else if (iMinutes.length === 5) {
        duration = (Number(iMinutes.substring(0, 2)) * 60) + Number(iMinutes.substring(3, 5))
    } else {
        throw new Error(`Invalid duration was passed ${iMinutes}`)
    }

    return duration
}

export function randomIndex(maxIndex: number): number {
    return (Math.floor(Math.random() * maxIndex) + 1) - 1
}

export function pageEntry(page: HTMLElement) {
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

export function pageExit(page: HTMLElement, remove: boolean = false) {
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
export function isDescended(child: HTMLElement, parent: HTMLElement) {
    let element: HTMLElement | null = child;
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
export function makeDraggable(dragger: HTMLElement, container: HTMLElement) {

    let rect = container.getBoundingClientRect()

    let left = rect.x
    let top = rect.y

    function updateContainerPosition() {
        let constrainedLeft, constrainedTop
        ({left: constrainedLeft, top: constrainedTop} = constrain(left, top))

        container.style.left = `${constrainedLeft}px`
        container.style.top = `${constrainedTop}px`
    }

    function constrain(left: number, top: number) {
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
        function moved(e: MouseEvent) {
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

/**
 * Given a youtube url, returns its id
 * @param url {string}
 * @return {string} Empty if no id, otherwise id
 */
export function extractId(url: string) {
    let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    let match = url.match(regExp);
    return (match&&match[7].length===11)? match[7] : false;
}
