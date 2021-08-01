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