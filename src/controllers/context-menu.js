import {MusicController, ObjectController} from "../controller.js";

function init() {
    let currentMenu;

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
        ],
        body: [
            {
                name: 'Test',
            }
        ]
    }

    function generateMenu(items, posX, posY) {
        let menu = document.createElement('div')
        menu.classList.toggle('context-menu')

        items.forEach((v,i) => {
            v.actions.forEach(v2 => {
                let newItem = document.createElement('div')
                newItem.classList.toggle('context-menu-item')
                newItem.textContent = v2.name
                if (v2.action) {
                    newItem.addEventListener('click', () => v2.action(v.context))
                }
                menu.insertAdjacentElement('beforeend', newItem)
            })
            if (i !== items.length - 1) {
                menu.insertAdjacentElement('beforeend', document.createElement('hr'))
            }
        })

        menu.style.left = `${posX}px`
        menu.style.top = `${posY}px`

        return menu
    }

    function clearContextMenu() {
        if (currentMenu) {
            currentMenu.remove()
            currentMenu = undefined
        }
    }

    document.addEventListener('contextmenu', e => {
        clearContextMenu()

        let items = []
        let target = e.target;

        while ((target = (target.parentElement))) {         // Loop through all parents until reach html element
            let actions = contexts[target.dataset.context]  // where parent = null, ending the loop
            if (actions) {
                items.push({context: target, actions})
            }
        }
        if (items.length > 0) {
            let newMenu = generateMenu(items, e.clientX, e.clientY)

            currentMenu = newMenu
            document.body.insertAdjacentElement('beforeend', newMenu)
        }

        e.preventDefault() // Probably not needed, but just in case
    })
}

export default init