// window.addEventListener('DOMContentLoaded', () => {
//     const replaceText = (selector, text) => {
//         const element = document.getElementById(selector)
//         if (element) element.innerText = text
//     }
//
//     for (const dependency of ['chrome', 'node', 'electron']) {
//         replaceText(`${dependency}-version`, process.versions[dependency])
//     }
// })

console.log("preloader running...")

const { contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('api', {
    // send: (channel, args) => {
    //     ipcRenderer.send(channel, args)
    // },
    receiveMoved: (func => {
        ipcRenderer.on("moved", func)
    })
})