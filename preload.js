console.log("preloader.js running...")
const {v4: uuidv4} = require('uuid')

const { contextBridge, ipcRenderer,  } = require('electron')

contextBridge.exposeInMainWorld('api', {
    getUUID: () => {return uuidv4()},
    isDev: ipcRenderer.sendSync('isdev')
})