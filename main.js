const { app, BrowserWindow } = require('electron')
const path = require('path')

require('electron-reload')(__dirname)

function createWindow () {
    const win = new BrowserWindow({
        width: 1200,
        height: 700,
        minWidth: 600,
        minHeight: 500,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        icon: path.join(__dirname, 'assets/btecify.ico'),
        alwaysOnTop: false,
        frame: false
    })

    win.loadFile('index.html')

    win.on('move', (e) => {
        win.webContents.send("moved")
    })
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
