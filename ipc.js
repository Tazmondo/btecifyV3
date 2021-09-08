const path = require("path");
const {ipcMain, globalShortcut, webContents} = require('electron')
const fs = require("fs");

const dbPath = './db'
fs.promises.mkdir(dbPath).then(res => {console.log("Made db path")}).catch(e => {console.log("db path already exists")})
const db = require('./db.js')(dbPath) // Initialise db in the database director

function ipc(main, isPackaged, appWindow) {
    let webContent = appWindow?.webContents
    for (let funcName in db) {
        if (!main) {
            return db
        }
        if (main) {
            ipcMain.handle(funcName, async (e, ...args) => {
                return await db[funcName](args)
            })
        }
        console.log(`Registering ${funcName} with:\n ${db[funcName]}`)
    }

    if (main) {

        ipcMain.on('getInputData', e => {
            e.returnValue = readInputData()
        })

        ipcMain.on('isDev', (e) => {
            e.returnValue = !isPackaged
        })

        ipcMain.on('unhotkey', (e) => {
            globalShortcut.unregisterAll()
            e.returnValue = undefined
        })

        ipcMain.on('sethotkey', (e, hotkeyString) => {
            e.returnValue = globalShortcut.register(hotkeyString, () => {
                // ??/??/?? - This is unreliable. todo: make me more reliable
                // 21/08/21 - this might be fixed now?
                webContent.send(hotkeyString)
            })
        })

        ipcMain.on('close', e => {
            e.returnValue = appWindow.close()
        })
    }

    let cachedContents;

    function readInputData() {

        if(cachedContents === undefined){
            let file = fs.readFileSync(path.join(__dirname, "./db/input.txt"))
            let contents = file.toString()
            cachedContents = JSON.parse(contents)
        }
        return cachedContents

    }
}

module.exports = ipc
