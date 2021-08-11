import {pageEntry, pageExit} from "../util.js";
import {EventController, MusicController, RouteController} from "../controller.js";

function initPage(posAfter=true) {
    let x = Date.now()
    console.log("init", x);
    const {subscribe, unSubscribe} = EventController
    const {back} = RouteController
    let page = document.querySelector('#queue-view-template').content.firstElementChild.cloneNode(true)
    let main = document.querySelector('main');

    if (posAfter) {
        main.insertAdjacentElement('beforeend', page)
    } else {
        main.insertBefore(page, Array.from(main.children).find(v => v.id.includes('-view')))
    }

    function drawPage(info) {

    }

    pageEntry(page)

    page.querySelector('.view-back').addEventListener('click', e=>{
        back()
    }, {once: true})

    subscribe('playing', drawPage)
    return function unInitPage() {
        console.log("uninit", x);

        unSubscribe('playing', drawPage)
        pageExit(page, true)

    }
}

export default initPage