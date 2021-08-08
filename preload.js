console.log("preloader.js running...")
const {v4: uuidv4, validate} = require('uuid')

const dbFunctions = require('./ipc.js')(false)
const { contextBridge, ipcRenderer } = require('electron')

let api = {
    getUUID: () => {return uuidv4()},

    uuidIsValid: (uuid) => {return validate(uuid)},

    isDev: ipcRenderer.sendSync('isDev'),

    getInputData: () => {
        return ipcRenderer.sendSync('getInputData')
    },
}

// Expose db functions to the renderer.
for (let funcName in dbFunctions) {
    console.log(`Registering ${funcName}`)
    api[funcName] = async (...args) => {
        return await ipcRenderer.invoke(funcName, ...args)
    }
}

contextBridge.exposeInMainWorld('api', api)