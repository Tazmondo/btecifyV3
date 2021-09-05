import {isDescended} from "../util.js";
import contexts from './context-menu-items.js'

function init() {
    const popperDiv = document.querySelector('#poppers')

    function generateMenu(items) {
        let subMenu;

        let menu = document.createElement('div')
        menu.classList.toggle('context-menu')

        items.forEach((contextDefinition,itemIndex) => {
            contextDefinition.actions.forEach(menuAction => {
                let newItem = document.createElement('div')
                newItem.classList.toggle('context-menu-item')
                newItem.textContent = menuAction.name

                newItem.onmouseenter = e => {
                    setTimeout(() => {
                        if (newItem.matches(':hover')) {
                            if (subMenu) subMenu.remove()
                        }
                    }, 100)
                }

                if (menuAction.disabled === undefined || !menuAction.disabled(contextDefinition.context)) {
                    switch (menuAction.type) {
                        case 'button': {
                            newItem.classList.toggle('button')
                            newItem.addEventListener('click', () => {
                                menuAction.action(contextDefinition.context)
                                clearContextMenu()
                            })

                            break
                        }
                        case 'extend': {
                            newItem.classList.toggle('extend')
                            newItem.onmouseenter = e => {
                                setTimeout(() => {
                                    if (newItem.matches(':hover')) {
                                        if (subMenu) subMenu.remove()
                                        subMenu = generateMenu(
                                            menuAction.extensionItems(
                                                contextDefinition.context, menuAction.action
                                            )
                                        )
                                        popperDiv.insertAdjacentElement('afterbegin', subMenu)
                                        subMenu.classList.toggle('closed')
                                        subMenu.classList.toggle('submenu')

                                        Popper.createPopper(newItem, subMenu, {
                                            placement: 'right-start',
                                            modifiers: [
                                                {
                                                    name: 'flip',
                                                    enabled: true,
                                                },
                                                {
                                                    name: 'offset',
                                                    enabled: true,
                                                    options: {
                                                        offset: [0, 5]
                                                    }
                                                }
                                            ]
                                        })

                                        requestAnimationFrame(() => {
                                            subMenu.classList.toggle('closed')
                                        })
                                    }
                                }, 100)
                            }
                            break
                        }

                    }
                } else {
                    newItem.classList.toggle('disabled')
                }

                menu.insertAdjacentElement('beforeend', newItem)
            })
            if (itemIndex !== items.length - 1) {
                menu.insertAdjacentElement('beforeend', document.createElement('hr'))
            }
        })

        return menu
    }

    let currentMenu;
    let currentPopper; // Must save this as creating a new popper without deleting old one can cause issues

    function clearContextMenu() {
        if (currentMenu) {
            Array.from(popperDiv.childNodes).forEach(node => {
                node.remove()
            })
            currentPopper.destroy()
            currentPopper = undefined
            currentMenu = undefined
        }
    }


    let pX = -1;
    let pY = -1;

    document.addEventListener('contextmenu', e => {
        let y = e.clientY;
        let x = e.clientX;

        if (currentMenu && pX === x && pY === y) {
            pX = -1
            pY = -1
            clearContextMenu()
            return
        }
        clearContextMenu()

        pX = x
        pY = y

        let items = []

        let target;
        while ((target = (target === undefined ? e.target : target.parentElement))) {         // Loop through all parents until reach html element
            let actions = []
            for (let selector in contexts) {
                if (target.matches(selector)) {
                    actions = actions.concat(contexts[selector])
                }
            }
            if (actions.length > 0) items.push({context: target, actions})
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
                getBoundingClientRect: generateGetBoundingClientRect(x, y)
            }


            currentMenu = newMenu
            currentPopper = Popper.createPopper(virtualElement, popperDiv, {
                placement: 'bottom-start',
                modifiers: [
                    {
                        name: 'flip',
                        enabled: true,
                    }
                ]
            })
            popperDiv.insertAdjacentElement('afterbegin', newMenu)
        }

        e.preventDefault() // Probably not needed, but just in case
    })

    document.addEventListener('click', e => {
        if (currentMenu) {
            if (!isDescended(e.target, popperDiv)) {
                clearContextMenu()
            }
        }
    })
}

export default init