import {pages, views} from '../pages/pages.js'
import {copyArray} from "../util.js";

function InitRouteController() {
    let currentRoute = []

    function getPageIdFromNavName(navName) {
        return navName.slice(0, -4)
    }

    function getViewIdFromName(viewName) {
        return viewName + "-view"
    }

    function baseRoute(pageName) {
        let func = pages[pageName]

        if (currentRoute.length > 0) {
            currentRoute[0][1]()
            currentRoute = []
        }
        currentRoute.unshift([func, func()])
    }

    function addView(viewName) {
        let func = views[viewName]

        currentRoute[0][1]()

        currentRoute.unshift([func, func()])

        let viewPage = document.getElementById(getViewIdFromName(viewName))
        viewPage.querySelector('.view-back').addEventListener('click', e=>{
            back()
        }, {once: true})
    }

    function back() {
        if (currentRoute.length > 1) {
            currentRoute.shift()[1]()
            currentRoute[0][0]()
        }
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
        baseRoute(getPageIdFromNavName(navButton.id))
    }

    return {
        routePageWithNavElement,
        addView,
        back,
        routeWithPageName(pageName) {
            let navId = pageName + "-nav"
            let navElement = document.getElementById(navId)
            routePageWithNavElement(navElement)
        }
    }
}

export default InitRouteController