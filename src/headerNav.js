import {RouteController, EventController} from "./controller.js";

function initNav() {
    const {routeWithNavElement} = RouteController

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

}

export default initNav