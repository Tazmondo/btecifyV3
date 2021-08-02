console.log("preloader running...")
const {v4: uuidv4} = require('uuid')

const { contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('api', {
    getUUID: () => {return uuidv4()}
})
