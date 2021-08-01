console.log("renderer.js running...")

import homePageFunction from './src/home.js'
import playlistPageFunction from './src/playlists.js'
import player from './src/player.js'


// HEADER //
let pageNames = {
    'home': homePageFunction,
    'playlist': playlistPageFunction
}


function getPageIdFromNav(navName) {
    return navName.slice(0, -4)
}

function route(navButton) {
    console.log(navButton)
    navButton.classList.toggle("active", true)

    let pageName = getPageIdFromNav(navButton.id)
    if (pageNames[pageName] === undefined) {
        throw "Invalid page"
    }

    Array.from(document.getElementsByTagName('main')).forEach(v => {
        v.remove()
    })
    pageNames[pageName]()
    console.log(`Routed to ${pageName}.`)
}

let navButtons = Array.from(document.getElementById("nav-bar").childNodes).filter(v => {return v.nodeName === "BUTTON"})

navButtons.forEach((v, i, arr) => {
    v.addEventListener("click", e =>{
        route(v)
        //document.getElementById(v.id + "-page").classList.toggle("visible", true) // Make the selected page visible
        arr.forEach(v2 => {
            if (v2 !== v) {
                v2.classList.toggle("active", false)
                //document.getE lementById(v2.id + "-page").classList.toggle("visible", false) // Make all other pages invisible
            }
        })
    })
})

// FOOTER //
player()

// MAIN EXECUTION //
document.getElementById('playlist-nav').click()
