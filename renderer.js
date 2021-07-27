console.log("renderer.js running...")

function randomColourCSS() {
    let r = Math.floor(Math.random()*256)
    let g = Math.floor(Math.random()*256)
    let b = Math.floor(Math.random()*256)
    return `rgb(${r}, ${g}, ${b})`
}

window.api.receiveMoved(() => {
    //console.log("Received")
    //document.body.style.backgroundColor = randomColourCSS();
})