console.log("renderer.js running...")



function randomColourCSS() {
    let r = Math.floor(Math.random()*256)
    let g = Math.floor(Math.random()*256)
    let b = Math.floor(Math.random()*256)
    return `rgb(${r}, ${g}, ${b})`
}

window.api.receiveMoved(() => {
    // [...document.querySelectorAll('*')].map((v) => {
    //     v.style.backgroundColor = randomColourCSS()
    // })
})

document.getElementById("shuffle").addEventListener("click", ev => {
    ev.currentTarget.classList.toggle("active")
})

document.getElementById("repeat").addEventListener("click", ev => {
    ev.currentTarget.classList.toggle("active")
})

let playButton = document.getElementById("play")
let pauseButton = document.getElementById("pause")

function togglePlayPause(ev) {
    playButton.classList.toggle("inactive")
    pauseButton.classList.toggle("inactive")
}

playButton.addEventListener("click", togglePlayPause)
pauseButton.addEventListener("click", togglePlayPause)

let seekerBackBar = document.getElementsByClassName("seeker-background")[0]
let seekerFrontBar = document.getElementsByClassName("seeker-foreground")[0]
let seekerThumb = document.getElementsByClassName("seeker-thumb")[0]

function getMousePosition(e, target) {
    // e = Mouse click event.
    let rect = target.getBoundingClientRect();
    let x = e.clientX - rect.left; //x position within the element.
    let y = e.clientY - rect.top;  //y position within the element.
    return [x, y]
}

function updateSeeker(e, target) {
    let relativeX = getMousePosition(e, seekerBackBar)[0]
    let widthPercentage = relativeX / seekerBackBar.clientWidth * 100
    if (widthPercentage < 0) {
        widthPercentage = 0
    } else if (widthPercentage > 100) {
        widthPercentage = 100
    }
    seekerFrontBar.style = `width: ${widthPercentage}%`
}

seekerBackBar.addEventListener("mousedown", e => {
    updateSeeker(e)

   document.addEventListener("mousemove", updateSeeker)
    document.addEventListener("mouseup", e => {
        document.removeEventListener("mousemove", updateSeeker)
    }, {once: true})
})
