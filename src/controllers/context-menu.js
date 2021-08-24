import {MusicController, ObjectController} from "../controller.js";
import {isDescended} from "../util.js";

function init() {
    let currentMenu;
    const popperDiv = document.querySelector('#poppers')

    const contexts = {
        '#home-nav-page': [
            {
                name: 'New Playlist',
                type: 'button',
                action: (context) => {
                    // Switch page to new playlist page, or bring up an input dialog box.
                }
            }
        ],

        '.playlist-card': [
            {
                name: 'Play',
                type: 'button',
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
            {
                name: 'Compare with...',
                type: 'extend',
                action: (context, extensionSelection) => {
                    console.log(`compare ${context.querySelector('h3').textContent} with ${extensionSelection?.getTitle()}`);
                },
                extensionItems: (context, callback) => {
                    let newItems = []
                    ObjectController.getPlaylistArray().filter(v => v.getTitle() !== context.querySelector('h3').textContent).forEach(playlist => {
                        newItems.push({
                            name: playlist.getTitle(),
                            type: 'button',
                            action: () => {
                                callback(context, playlist)
                            }
                        })
                    })
                    return [{context, actions: newItems}]
                }
            },
            {
                name: 'Delete Playlist',
                type: 'button',
                action: (context) => {
                    // Delete the playlist
                }
            }
        ],

        '#playlist-nav-page .song-list-item': [
            {
                name: 'Remove from this playlist',
                type: 'button',
                action: (context) => {
                    context.querySelector('.playlist-page-remove-from-playlist').dispatchEvent(new Event('click'))
                }
            },
            {
                name: 'Add to other playlist',
                type: 'button',
                disabled: (context) => {
                    return context.querySelectorAll('.playlist-page-add-to-playlist.inactive').length === 2
                },
                action: (context) => {
                    context.querySelector('.playlist-page-add-to-playlist').dispatchEvent(new Event('click'))
                }
            }
        ],

        '.song-list-item': [
            {
                name: 'Play',
                type: 'button',
                action: (context) => {
                    context.dispatchEvent(new Event('dblclick'))
                }
            }
        ],

        'img, .thumb, .img-div': [
            {
                name: 'Copy image',
                type: 'button',
                action: (context) => {
                    let newImg = new Image() // Since the og image object may be cropped or resized etc
                    let backgroundImage = context.style.backgroundImage;

                    // Image is either a src or a background image.
                    newImg.src = context.src || (backgroundImage.substring(5, backgroundImage.length - 2))
                    let canvas = document.createElement('canvas');
                    let canvasContext = canvas.getContext('2d');
                    canvas.width = newImg.width;
                    canvas.height = newImg.height;
                    canvasContext.drawImage(newImg, 0, 0 );
                    canvas.toBlob(blob => {
                        navigator.clipboard.write(
                            [new ClipboardItem({
                                [blob.type]: blob
                            })]
                        )
                    })
                }
            }
        ],
    }

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
                                        subMenu.classList.toggle('submenu')
                                        popperDiv.insertAdjacentElement('afterbegin', subMenu)
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

    function clearContextMenu() {
        if (currentMenu) {
            Array.from(popperDiv.childNodes).forEach(node => {
                node.remove()
            })
            currentMenu = undefined
        }
    }




    document.addEventListener('contextmenu', e => {
        clearContextMenu()

        let items = []
        let target;

        while ((target = (target === undefined ? e.target : target.parentElement))) {         // Loop through all parents until reach html element
            for (let selector in contexts) {
                if (target.matches(selector)) {
                    let actions = contexts[selector]
                    items.push({context: target, actions})
                }
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
                getBoundingClientRect: generateGetBoundingClientRect(e.clientX - 1, e.clientY - 1)
            }


            currentMenu = newMenu
            popperDiv.insertAdjacentElement('afterbegin', newMenu)
            Popper.createPopper(virtualElement, popperDiv, {
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
            if (!isDescended(e.target, popperDiv)) {
                clearContextMenu()
            }
        }
    })
}

export default init