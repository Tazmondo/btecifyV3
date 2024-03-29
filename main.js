const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
let ipcLoad = require('./ipc.js')


console.log(`Electron: ${process.versions.electron}
Chromium: ${process.versions.chrome}
Node: ${process.versions.node}`)

if (!app.isPackaged) {
    app.setPath('userData', app.getPath('userData')+'-test')
    console.log(app.getPath('userData'))
    app.commandLine.appendSwitch('remote-debugging-port', '8315')
    console.log("reload")
    require('electron-reload')(__dirname+'/src')
}

function createWindow () {
    const win = new BrowserWindow({
        width: 1200,
        height: 700,
        minWidth: 600,
        minHeight: 500,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        icon: path.join(__dirname, 'src/assets/btecify.ico'),
        alwaysOnTop: false,
        frame: false
    })
    // win.webContents.openDevTools()
    ipcLoad(true, app.isPackaged, win)
    win.loadFile('src/index.html')

}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})
