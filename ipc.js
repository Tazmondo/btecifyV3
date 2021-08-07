const path = require("path");
const {ipcMain} = require('electron')
const fs = require("fs");
const db = require('./src/db.js')(path.join(__dirname, './db')) // Initialise db in the database director

function ipc(main, isPackaged) {
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
            e.returnValue = isPackaged
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