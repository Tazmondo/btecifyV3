import {pages, views} from '../pages/pages.js'
import {copyArray, pageExit, pageEntry} from "../util.js";
import {dispatch} from "./event.js";

function Route(construct, name, view, args) {
    let deconstructFunc;
    let element;

    function constructAndParse(posAfter = true) {
        let main = document.querySelector('main');
        let res = construct(args)

        let element;
        let deconstruct;
        if (Array.isArray(res)) {
            deconstruct = res[0]
            element = res[1]
        } else {
            deconstruct = res
        }
        if (view) {
            element.querySelector('.view-header').addEventListener('click', e=>{
                back()
            }, {once: true})

            if (posAfter) {
                main.insertAdjacentElement('beforeend', element)
            } else {
                main.insertBefore(element, Array.from(main.children).find(v => v.id.includes('-view')))
            }
        }
        pageEntry(element)

        return [deconstruct, element]
    }
    let res = constructAndParse()
    deconstructFunc = res[0]
    element = res[1]
    return {
        name,
        construct: function(posAfter) { // Can't use anonymous function otherwise this would not work
            let res = constructAndParse(posAfter)
            deconstructFunc = res[0]
            element = res[1]
        },
        deconstruct: function() {
            deconstructFunc()
            pageExit(element, view)
        },
    }
}

let currentRoute = []

function getPageIdFromNavName(navName) {
    return navName.slice(0, -4)
}

function getViewIdFromName(viewName) {
    return viewName + "-view"
}

function route(func, pageName, view, args) {
    let newRoute = Route(func, pageName, view, args)
    currentRoute.unshift(newRoute)

    dispatch('currentpage')
}

function pageRoute(pageName, args) {
    let func;
    func = pages[pageName]

    if (currentRoute.length > 0) {
        currentRoute[0].deconstruct()
        currentRoute = []
    }

    route(func, pageName, false, args)
}

function viewRoute(pageName, args) {
    let func = views[pageName]
    currentRoute[0].deconstruct()
    route(func, pageName, true, args)
}

export function baseRoute(pageName, args) {
    if (pages[pageName]) {
        pageRoute(pageName, args)
    } else if (views[pageName]) {
        viewRoute(pageName, args)
    }
}

export function back() {
    if (currentRoute.length > 1) {
        let topRoute = currentRoute.shift();
        topRoute.deconstruct()
        currentRoute[0].construct(false)

        dispatch('currentpage')
    }
}

export function routePageWithNavElement(navButton) {
    pageRoute(getPageIdFromNavName(navButton.id))
}

export function getCurrentRouteName() {
    return currentRoute[0]?.name
}
