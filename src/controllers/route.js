import {pages, views} from '../pages/pages.js'
import {copyArray} from "../util.js";

function InitRouteController(dispatch) {
    function Route(construct, name) {
        function constructAndParse(posAfter) {
            let res = construct(posAfter)
            let element;
            let deconstruct;
            if (Array.isArray(res)) {
                deconstruct = res[0]
                element = res[1]
            } else {
                deconstruct = res
            }
            return [deconstruct, element]
        }
        let res = constructAndParse()
        return {
            name,
            construct: function(posAfter) { // Can't use anonymous function otherwise this would not work
                let res = constructAndParse(posAfter)
                this.deconstruct = res[0]
                this.element = res[1]
            },
            deconstruct: res[0],
            element: res[1]
        }
    }

    let currentRoute = []

    function getPageIdFromNavName(navName) {
        return navName.slice(0, -4)
    }

    function getViewIdFromName(viewName) {
        return viewName + "-view"
    }

    function route(func, pageName) {
        let newRoute = Route(func, pageName)
        currentRoute.unshift(newRoute)

        dispatch('currentpage')
    }

    function pageRoute(pageName) {
        let func;
        func = pages[pageName]

        if (currentRoute.length > 0) {
            currentRoute[0].deconstruct()
            currentRoute = []
        }

        route(func, pageName)
    }

    function viewRoute(pageName) {
        let func = views[pageName]
        currentRoute[0].deconstruct()
        route(func, pageName)
    }

    function baseRoute(pageName) {
        if (pages[pageName]) {
            pageRoute(pageName)
        } else if (views[pageName]) {
            viewRoute(pageName)
        }
    }

    function back() {
        if (currentRoute.length > 1) {
            let topRoute = currentRoute.shift();
            topRoute.deconstruct()
            currentRoute[0].construct(false)

            dispatch('currentpage')
        }
    }

    function routePageWithNavElement(navButton) {
        pageRoute(getPageIdFromNavName(navButton.id))
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