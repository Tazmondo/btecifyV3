console.log("preloader.js running...")
const {v4: uuidv4, validate} = require('uuid')

const { contextBridge, ipcRenderer,  } = require('electron')

contextBridge.exposeInMainWorld('api', {
    getUUID: () => {return uuidv4()},

    uuidIsValid: (uuid) => {return validate(uuid)},

    isDev: ipcRenderer.sendSync('isDev'),

    getInputData: () => {
        return ipcRenderer.sendSync('getInputData')
    },

    // Returns a promise to the path to a thumbnail image, or an empty string if it doesn't exist.
    fetchThumbnail: async (uuid, url) => {
        let result = await ipcRenderer.invoke('fetchThumbnail', uuid, url)
        return result
    },

    fetchMusic: (url, uuid) => {
        // todo: download music through main.js
}
})