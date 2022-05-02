import * as EventController from './controllers/event.js'
import * as RouteController from './controllers/route.js'

function initNav() {
    const {routePageWithNavElement} = RouteController
    const {subscribe} = EventController

    let navButtons = Array.from(document.getElementById("nav-bar")!.childNodes).filter(v => {
        return v.nodeName === "BUTTON"
    }) as HTMLElement[]

    function getNavFromName(name: string) {
        return navButtons.find(v => v.id === name + "-nav")
    }

    navButtons.forEach(v => {
        v.addEventListener("click", e =>{
            routePageWithNavElement(v)
        })
    })

    let closeButton = document.querySelector('header .app-close')!
    closeButton.addEventListener('click', e => {
        // @ts-ignore
        api.close()
    })

    subscribe('currentpage', (routeName: string) => {
        let navFromName = getNavFromName(routeName);
        navButtons.forEach(button => button.classList.toggle('active', false))
        if (navFromName) {
            navFromName.classList.toggle('active', true)
        }
    })

}

export default initNav
