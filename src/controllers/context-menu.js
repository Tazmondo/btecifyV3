import {MusicController, ObjectController} from "../controller.js";
import {isDescended} from "../util.js";

function init() {
    let currentMenu;

    const contexts = {
        playlist: [
            {
                name: 'Play',
                action: (context) => {
                    // Not sure if context should just be the element or whether it
                    // should just pass the relevant details, like playlist title
                    MusicController.setPlaylist(
                        ObjectController.getPlaylistFromTitle(
                            context.querySelector('h3').textContent
                        )
                    )
                }
            },
        ],
    }

    function generateMenu(items) {
        let menu = document.createElement('div')
        menu.classList.toggle('context-menu')

        items.forEach((contextDefinition,itemIndex) => {
            contextDefinition.actions.forEach(menuAction => {
                let newItem = document.createElement('div')
                newItem.classList.toggle('context-menu-item')
                newItem.textContent = menuAction.name
                if (menuAction.action) {
                    newItem.addEventListener('click', () => {
                        menuAction.action(contextDefinition.context)
                        clearContextMenu()
                    })
                }
                menu.insertAdjacentElement('beforeend', newItem)
            })
            if (itemIndex !== items.length - 1) {
                menu.insertAdjacentElement('beforeend', document.createElement('hr'))
            }
        })

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
            let newMenu = generateMenu(items)

            function generateGetBoundingClientRect(x = 0, y = 0) {
                return () => ({
                    width: 0,
                    height: 0,
                    top: y,
                    right: x,
                    bottom: y,
                    left: x,
                })
            }

            const virtualElement = {
                getBoundingClientRect: generateGetBoundingClientRect(e.clientX, e.clientY)
            }


            currentMenu = newMenu
            document.body.insertAdjacentElement('beforeend', newMenu)
            Popper.createPopper(virtualElement, newMenu, {
                placement: 'bottom-start',
                modifiers: [
                    {
                        name: 'flip',
                        enabled: false
                    }
                ]
            })
        }

        e.preventDefault() // Probably not needed, but just in case
    })

    document.addEventListener('click', e => {
        if (currentMenu) {
            if (!isDescended(e.target, currentMenu)) {
                clearContextMenu()
            }
        }
    })
}

export default init