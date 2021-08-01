console.log("renderer running...")

import './home.js'
import './playlist.js'

function getPageIdFromNav(navName) {
    return navName.slice(0, -4)
}

function routeWithPageName(pageName) {
    let navId = pageName + "-nav"
    let navElement = document.getElementById(navId)
    routeWithNavElement(navElement)
}

function routeWithNavElement(navButton) {
    console.log(navButton)
    navButton.classList.toggle("active", true)

    let pageName = getPageIdFromNav(navButton.id)
    // if (pageNames[pageName] === undefined) {
    //     throw "Invalid page"
    // }

    let selectedPage = document.getElementById(navButton.id + "-page")
    Array.from(document.querySelectorAll('main > div')).forEach(v => {
        v.classList.toggle('hidden', true)
    })
    selectedPage.classList.toggle('hidden', false)

    // pageNames[pageName]()
    console.log(`Routed to ${pageName}.`)
}

let navButtons = Array.from(document.getElementById("nav-bar").childNodes).filter(v => {return v.nodeName === "BUTTON"})

navButtons.forEach((v, i, arr) => {
    v.addEventListener("click", e =>{
        routeWithNavElement(v)
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
import player from './player.js'
player()

// MAIN EXECUTION //
routeWithPageName('playlist')