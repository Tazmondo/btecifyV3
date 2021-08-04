const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const db = require('./src/db.js')(path.join(app.getAppPath(), './db')) // Initialise db in the database directory

db.songExists("poggers").then(res => {
    console.log(res)
})

app.commandLine.appendSwitch('remote-debugging-port', '8315')

// if (!app.isPackaged) {
//     console.log("reload")
//     require('electron-reload')(app.getAppPath())
// }

function createWindow () {
    const win = new BrowserWindow({
        width: 1200,
        height: 700,
        minWidth: 600,
        minHeight: 500,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        icon: path.join(app.getAppPath(), 'src/assets/btecify.ico'),
        alwaysOnTop: false,
        frame: false
    })

    win.loadFile('src/index.html')

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

ipcMain.on('getInputData', e=> {
    e.returnValue = readInputData()
})

ipcMain.on('isDev', (e) => {
    e.returnValue = !app.isPackaged
})

ipcMain.handle('fetchThumbnail', async (event, ...args) => {
    return await db.songExists(args[0])
})

app.whenReady().then(() => {

    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})
