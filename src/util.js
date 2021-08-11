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
    page.classList.toggle("switching", true)
    page.dataset.exit = "false"

    setTimeout(() => {
        page.classList.toggle("hidden",false)
    }, 1) // Without this delay, the animation is sometimes skipped.

    setTimeout(() => {
        if (!page.dataset.exit === "true") {
            page.classList.toggle("switching", false)
        }
    }, 800) // Transition length + a bit
}

export function pageExit(page) {
    page.dataset.exit = "true"
    page.classList.toggle("switching", true)
    page.classList.toggle("hidden", true)
}
