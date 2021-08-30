import {MusicController, ObjectController, RouteController} from "../controller.js";
import {isDescended} from "../util.js";
import {generateInputDialog} from "./dialog-box.js";

function init() {
    const popperDiv = document.querySelector('#poppers')

    const contexts = {
        'body' : [
            {
                name: 'Test Dialog box',
                type: 'button',
                action: context => {
                    generateInputDialog("A test dialog box", "This is a test!", {
                        inputs: [{type: 'text', label: 'test input'}]
                    })
                }
            }
        ],
        '#home-nav-page': [ // todo
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
                name: 'View songs',
                type: 'button',
                action: context => {
                    let title = context.querySelector('h3').textContent;
                    let playlist = ObjectController.getPlaylistFromTitle(title)

                    RouteController.baseRoute('playlistView', [playlist])
                }
            },
            {
                name: 'Compare with...',
                type: 'extend',
                action: (context, extensionSelection) => {
                    let title1 = context.querySelector('h3').textContent;
                    let title2 = extensionSelection?.getTitle();
                    RouteController.baseRoute('playlist', [title1, title2])
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
                name: 'Rename Playlist',
                type: 'button',
                action: context => {
                    let playlist = ObjectController.getPlaylistFromTitle(context.querySelector('h3').textContent)
                    generateInputDialog("Rename", `Rename ${playlist.getTitle()}...`, {
                        inputs: [{type: 'text', label: 'New Title'}]
                    }).then(res => {
                        let newTitle = res[0]
                        if (newTitle && typeof newTitle === "string" && newTitle !== playlist.getTitle()) {
                            ObjectController.renamePlaylist(playlist, newTitle)
                        }
                    })
                    // rename playlist
                }
            },
            { // todo
                name: 'Set Thumbnail',
                type: 'button',
                action: context => {
                    // set new thumbnail
                }
            },
            { // todo
                name: 'Delete Playlist',
                type: 'button',
                action: (context) => {
                    // Delete the playlist
                }
            }
        ],

        '#playlist-nav-page .song-list-item, #playlist-view .song-list-item': [
            {
                name: 'Remove from this playlist',
                type: 'button',
                action: (context) => {
                    context.querySelector('.playlist-page-remove-from-playlist').dispatchEvent(new Event('click'))
                }
            },
        ],

        '#playlist-nav-page .song-list-item': [
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