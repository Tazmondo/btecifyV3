console.log("preloader.js running...")
const {v4: uuidv4, validate} = require('uuid')

const { contextBridge, ipcRenderer,  } = require('electron')

contextBridge.exposeInMainWorld('api', {
    getUUID: () => {return uuidv4()},
    uuidIsValid: (uuid) => {return validate(uuid)},
    isDev: ipcRenderer.sendSync('isdev'),
    getInputData: () => {
        return ipcRenderer.sendSync('getinputdata')
    }
})