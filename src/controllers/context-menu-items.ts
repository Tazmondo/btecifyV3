import * as MusicController from './music.js'
import * as ObjectController from './object.js'
import {deleteSong, deleteUnusedSongs, getSongFromId} from './object.js'
import * as RouteController from './route.js'
import {generateInputDialog} from "./dialog-box.js";
import {apiPlaylistShallow} from "./types";

function getOtherPlaylists(context: HTMLElement, callback: (context: HTMLElement, playlist: apiPlaylistShallow) => void) {
    let newItems: ContextItem[] = []
    ObjectController.getPlaylistArray().filter(v => v.title !== context.querySelector('h3')?.textContent).forEach(playlist => {
        newItems.push({
            name: playlist.title,
            type: 'button',
            action: () => {
                callback(context, playlist)
            }
        })
    })
    return [{context, actions: newItems}]
}

interface ContextItem {
    name: string
    type: "button" | "extend"
    action: (context: any, extensionSelection: any) => void
    extensionItems?: (context: HTMLElement, callback: (arg0: any) => void) => { context: HTMLElement, actions: ContextItem[] }[]
    disabled?: (context: HTMLElement) => boolean
}

const contexts: { [key: string]: ContextItem[] } = {
    'body': [
        // {
        //     name: 'Test Dialog box',
        //     type: 'button',
        //     action: context => {
        //         generateInputDialog("A test dialog box", "This is a test!", {
        //             inputs: [{type: 'text', label: 'test input'}],
        //             type: 'confirm'
        //         })
        //     }
        // }
    ],
    '#home-nav-page': [
        {
            name: 'New Playlist',
            type: 'button',
            action: () => {
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
                }).then(async res => {
                    if (!(typeof res == "boolean")) {
                        let name = res[0]
                        let url = res[1]
                        if (name !== "" && url !== "") {
                            ObjectController.makeRemotePlaylist(name, url).then(newPlaylist => {
                                if (newPlaylist) {
                                    RouteController.baseRoute('playlistView', [newPlaylist])
                                }
                            })
                        } else {
                            let newPlaylist = await ObjectController.makePlaylist(name)
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
            action: (context: HTMLElement) => {
                // Not sure if context should just be the element or whether it
                // should just pass the relevant details, like playlist title
                let title = context.querySelector('h3')?.textContent;
                if (title) {
                    let playlistFromTitle = ObjectController.getPlaylistFromTitle(title);
                    if (playlistFromTitle) {
                        MusicController.setPlaylist(playlistFromTitle)
                    }
                }
            }
        },
        {
            name: 'View songs',
            type: 'button',
            action: (context: HTMLElement) => {
                let title = context.querySelector('h3')!.textContent!
                let playlist = ObjectController.getPlaylistFromTitle(title)

                RouteController.baseRoute('playlistView', [playlist])
            }
        },
        {
            name: 'Compare with...',
            type: 'extend',
            action: (context: HTMLElement, extensionSelection: apiPlaylistShallow) => {
                let title1 = context.querySelector('h3')?.textContent
                let title2 = extensionSelection.title;
                RouteController.baseRoute('playlist', [title1, title2])
            },
            extensionItems: getOtherPlaylists
        },
        {
            name: 'Merge songs from...',
            type: 'extend',
            action: (context: HTMLElement, extensionSelection: apiPlaylistShallow) => {
                let title1 = context.querySelector('h3')!.textContent
                let title2 = extensionSelection?.title
                // todo: add merging implementation
            },
            extensionItems: getOtherPlaylists
        },
        {
            name: 'Rename Playlist',
            type: 'button',
            action: (context: HTMLElement) => {
                let playlist = ObjectController.getPlaylistFromTitle(context.querySelector('h3')?.textContent!)!
                generateInputDialog("Rename", `Rename ${playlist.getTitle()}...`, {
                    inputs: [{type: 'text', label: 'New Title'}]
                }).then(res => {
                    if (!(typeof res == "boolean")) {
                        let newTitle = res[0]
                        if (newTitle !== undefined && newTitle !== playlist.getTitle()) {
                            ObjectController.renamePlaylist(playlist, newTitle)
                        }
                    }
                })
                // rename playlist
            }
        },
        { // todo
            name: 'Set Thumbnail',
            type: 'button',
            action: (context: HTMLElement) => {
                // set new thumbnail
            }
        },
        {
            name: 'Refresh Thumbnail',
            type: 'button',
            action: (context: HTMLElement) => {
                let playlist = ObjectController.getPlaylistFromTitle(context.querySelector('h3')?.textContent!)!
                playlist.refreshThumb()
            }
        },
        {
            name: 'Delete Playlist',
            type: 'button',
            action: (context: HTMLElement) => {
                let playlist = ObjectController.getPlaylistFromTitle(context.querySelector('h3')?.textContent!)!
                let res = ObjectController.deletePlaylist(playlist)
            }
        }
    ],
    '#song-nav-page': [
        {
            name: 'Delete unused songs',
            type: 'button',
            action: () => {
                deleteUnusedSongs()
            }
        }
    ],

    '.song-list-item': [
        {
            name: 'Play',
            type: 'button',
            action: (context: HTMLElement) => {
                context.dispatchEvent(new Event('dblclick'))
            }
        },
        {
            name: 'Delete',
            type: 'button',
            action: (context: HTMLElement) => {
                let id = context?.dataset?.uuid
                if (id) {
                    deleteSong(getSongFromId(Number(id))!)
                }
            }
        },
        {
            name: 'Copy URL to clipboard',
            type: 'button',
            action: (context: HTMLElement) => {
                let uuid = context?.dataset?.uuid
                if (uuid) {
                    let song = getSongFromId(Number(uuid))!
                    navigator.clipboard.writeText(song.weburl)
                }
            }
        }
    ],

    '#playlist-nav-page .song-list-item': [
        {
            name: 'Add to other playlist',
            type: 'button',
            disabled: (context: HTMLElement) => {
                return context.querySelectorAll('.playlist-page-add-to-playlist.inactive')?.length === 2
            },
            action: (context: HTMLElement) => {
                context.querySelector('.playlist-page-add-to-playlist')!.dispatchEvent(new Event('click'))
            }
        }
    ],

    '#playlist-nav-page .song-list-item, #playlist-view .song-list-item': [
        {
            name: 'Remove from this playlist',
            type: 'button',
            action: (context: HTMLElement) => {
                context.querySelector('.playlist-page-remove-from-playlist')!.dispatchEvent(new Event('click'))
            }
        },
    ],

    'img, .thumb, .img-div': [
        {
            name: 'Copy image',
            type: 'button',
            action: (context: HTMLImageElement) => {
                let newImg = new Image() // Since the og image object may be cropped or resized etc
                let backgroundImage = context.style.backgroundImage;

                // Image is either a src or a background image.
                newImg.src = (context as HTMLImageElement).src || (backgroundImage.substring(5, backgroundImage.length - 2))
                let canvas = document.createElement('canvas')
                let canvasContext = canvas.getContext('2d')!
                canvas.width = newImg.width;
                canvas.height = newImg.height;
                canvasContext.drawImage(newImg, 0, 0);
                canvas.toBlob(blob => {
                    if (blob !== null) {
                        navigator.clipboard.write(
                            [new ClipboardItem({
                                [blob.type]: blob
                            })]
                        )
                    }
                })
            }
        }
    ],
};

export default contexts
