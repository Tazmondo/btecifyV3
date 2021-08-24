import {pages, views} from '../pages/pages.js'
import {copyArray} from "../util.js";

function Route(construct, deconstruct, name) {
    return {
        name,
        construct,
        deconstruct
    }
}

function InitRouteController(dispatch) {
    let currentRoute = []

    function getPageIdFromNavName(navName) {
        return navName.slice(0, -4)
    }

    function getViewIdFromName(viewName) {
        return viewName + "-view"
    }

    function baseRoute(pageName) {
        let func;

        if (pages[pageName]) {
            func = pages[pageName]

            if (currentRoute.length > 0) {
                currentRoute[0].deconstruct()
                currentRoute = []
            }

        } else if (views[pageName]) {
            func = views[pageName]
            currentRoute[0].deconstruct()
        }

        if (func) {
            let newRoute = Route(func, func(), pageName)
            currentRoute.unshift(newRoute)

            dispatch('currentpage')
        }
    }

    function back() {
        if (currentRoute.length > 1) {
            currentRoute.shift().deconstruct()
            currentRoute[0].deconstruct = currentRoute[0].construct(false)

            dispatch('currentpage')
        }
    }

    function routePageWithNavElement(navButton) {
        baseRoute(getPageIdFromNavName(navButton.id))
    }

    return {
        routePageWithNavElement,
        baseRoute,
        back,
        getCurrentRouteName() {
            return currentRoute[0]?.name
        },
    }
}

export default InitRouteController