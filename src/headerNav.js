import {RouteController, EventController} from "./controller.js";

function initNav() {
    const {routePageWithNavElement} = RouteController
    const {subscribe} = EventController

    let navButtons = Array.from(document.getElementById("nav-bar").childNodes).filter(v => {return v.nodeName === "BUTTON"})

    function getNavFromName(name) {
        return navButtons.find(v => v.id === name + "-nav")
    }

    navButtons.forEach(v => {
        v.addEventListener("click", e =>{
            routePageWithNavElement(v)
        })
    })

    subscribe('currentpage', (routeName) => {
        let navFromName = getNavFromName(routeName);
        navButtons.forEach(button => button.classList.toggle('active', false))
        if (navFromName) {
            navFromName.classList.toggle('active', true)
        }
    })

}

export default initNav