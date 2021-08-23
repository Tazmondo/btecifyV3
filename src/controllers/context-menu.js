import {ObjectController, MusicController} from "../controller.js";

function init() {
    const contexts = {
        playlist: [
            {
                name: 'Play',
                action: (context) => {
                    // Not sure if context should just be the element or whether it
                    // should just pass the relevant details, like playlist title
                    MusicController.setPlaylist(ObjectController.getPlaylistFromTitle(context.querySelector('h3').textContent))
                }
            }
        ]
    }

    document.addEventListener('contextmenu', e => {
        let items = []
        let target = e.target;

        while ((target = (target.parentElement))) {         // Loop through all parents until reach html element
            let context = contexts[target.dataset.context]  // where parent = null, ending the loop
            if (context) {
                items.push(context)
            }
        }

        e.preventDefault() // Probably not needed, but just in case
    })
}

export default init