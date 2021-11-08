import * as MusicController from './music.js'
import * as ObjectController from './object.js'
import * as RouteController from './route.js'
import {generateInputDialog} from "./dialog-box.js";
import {deleteSong, getSongFromUUID} from "./object.js";

const contexts = {
    'body': [
        {
            name: 'Test Dialog box',
            type: 'button',
            action: context => {
                generateInputDialog("A test dialog box", "This is a test!", {
                    inputs: [{type: 'text', label: 'test input'}],
                    type: 'confirm'
                })
            }
        }
    ],
    '#home-nav-page': [
        {
            name: 'New Playlist',
            type: 'button',
            action: (context) => {
                // Switch page to new playlist page, or bring up an input dialog box.
                generateInputDialog("New Playlist", "Please enter the name of the playlist", {
                    type: "input",
                    inputs: [
                        {
                            type: "text",
                            label: "Playlist Name"
                        },
                        {
                            type: "text",
                            label: "Playlist URL (optional)"
                        }
                    ]
                }).then(res => {
                    let name = res[0]
                    let url = res[1]
                    if (typeof name === "string" && name !== "") {
                        if (typeof url === "string" && url !== "") {
                            ObjectController.makeRemotePlaylist(name, url).then(newPlaylist => {
                                if (newPlaylist) {
                                    RouteController.baseRoute('playlistView', [newPlaylist])
                                }
                            })
                        } else{
                            let newPlaylist = ObjectController.makePlaylist([name])
                            if (newPlaylist) {
                                // RouteController.baseRoute('playlistView', [newPlaylist])
                            }
                        }
                    }
                })
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
        {
            name: 'Delete Playlist',
            type: 'button',
            action: (context) => {
                let playlist = ObjectController.getPlaylistFromTitle(context.querySelector('h3').textContent)
                let res = ObjectController.deletePlaylist(playlist)
                console.log(playlist, res)
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
        },
        {
            name: 'Delete',
            type: 'button',
            action: (context) => {
                let uuid = context?.dataset?.uuid
                if (uuid) {
                    deleteSong(getSongFromUUID(uuid))
                }
            }
        }
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

    '#playlist-nav-page .song-list-item, #playlist-view .song-list-item': [
        {
            name: 'Remove from this playlist',
            type: 'button',
            action: (context) => {
                context.querySelector('.playlist-page-remove-from-playlist').dispatchEvent(new Event('click'))
            }
        },
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
                canvasContext.drawImage(newImg, 0, 0);
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
};

export default contexts