console.log("renderer running...")

import './home.js'
import './playlist.js'
import './player.js'
import './objects.js'
import './controller.js'

function getPageIdFromNav(navName) {
    return navName.slice(0, -4)
}

function routeWithPageName(pageName) {
    let navId = pageName + "-nav"
    let navElement = document.getElementById(navId)
    routeWithNavElement(navElement)
}

function routeWithNavElement(navButton) {
    navButton.classList.toggle("active", true)

    let pageName = getPageIdFromNav(navButton.id)

    let selectedPage = document.getElementById(navButton.id + "-page")
    Array.from(document.querySelectorAll('main > div')).forEach(v => {
        v.classList.toggle('hidden', true)
    })
    selectedPage.classList.toggle('hidden', false)

    console.log(`Routed to ${pageName}.`)
}

let navButtons = Array.from(document.getElementById("nav-bar").childNodes).filter(v => {return v.nodeName === "BUTTON"})

navButtons.forEach((v, i, arr) => {
    v.addEventListener("click", e =>{
        routeWithNavElement(v)
        arr.forEach(v2 => {
            if (v2 !== v) {
                v2.classList.toggle("active", false)
            }
        })
    })
})


// MAIN EXECUTION //
routeWithPageName('home')
