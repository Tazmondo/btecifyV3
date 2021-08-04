console.log("utils.js running")

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
    if (duration.length === 8) {
        duration = (Number(iMinutes.substr(3, 2)) * 60) + Number(iMinutes.substr(6, 2))
    } else if (duration.length === 5) {
        duration = (Number(iMinutes.substr(0, 2)) * 60) + Number(iMinutes.substr(3, 2))
    } else {
        throw new Error("Invalid duration was passed? This shouldn't be possible.")
    }

    return duration
}
