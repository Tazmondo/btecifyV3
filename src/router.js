function getPageIdFromNavName(navName) {
    return navName.slice(0, -4)
}

function routeWithNavElement(navButton) {
    navButton.classList.toggle("active", true)

    let pageName = getPageIdFromNavName(navButton.id)

    let selectedPage = document.getElementById(navButton.id + "-page")
    Array.from(document.querySelectorAll('main > div')).forEach(v => {
        v.classList.toggle('switching', true)
        v.classList.toggle('hidden', true)
        v.addEventListener('transitionend', () => {
            v.classList.toggle('switching', false)
        })
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

export function routeWithPageName(pageName) {
    let navId = pageName + "-nav"
    let navElement = document.getElementById(navId)
    routeWithNavElement(navElement)
}
