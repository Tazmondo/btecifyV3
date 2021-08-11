import pages from '../pages/pages.js'
import {copyArray} from "../util.js";

console.log(pages);

function InitRouteController() {
    let currentRoute = []
    let count = 0;

    function getPageIdFromNavName(navName) {
        return navName.slice(0, -4)
    }

    function route(pageName) {
        let pageInfo = pages[pageName]
        let func = pageInfo.func
        let order = pageInfo.order
        let insertAfter = true;

        if (currentRoute.length > 0) {
            let prevPage = currentRoute[0]
            if (prevPage[1] > order) {
                insertAfter = false
            }
            currentRoute.forEach(info => {
                info[0]()
            })
            currentRoute = []
        }
        currentRoute.unshift([func(insertAfter ? 'beforeend' : 'afterbegin'), order])
    }

    // function routePageWithNavElement(navButton) {
    //     navButton.classList.toggle("active", true)
    //
    //     let pageName = getPageIdFromNavName(navButton.id)
    //
    //     let selectedPage = document.getElementById(navButton.id + "-page")
    //     Array.from(document.querySelectorAll('main > div')).forEach(v => {
    //         v.classList.toggle('switching', true)
    //         v.classList.toggle('hidden', true)
    //         v.addEventListener('transitionend', (e) => {
    //             if (e.target === v) {
    //                 v.classList.toggle('switching', false)
    //             }
    //         })
    //     })
    //     selectedPage.classList.toggle('hidden', false)
    //
    //     console.log(`Routed to ${pageName}.`)
    // }

    function routePageWithNavElement(navButton) {
        route(getPageIdFromNavName(navButton.id))
    }

    return {
        routePageWithNavElement,
        routeWithPageName(pageName) {
            let navId = pageName + "-nav"
            let navElement = document.getElementById(navId)
            routePageWithNavElement(navElement)
        },
    }
}

export default InitRouteController