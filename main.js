/* Import modules */
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const log = require("./logger")
const os = require("os")

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })


    mainWindow.loadFile('./app/index.html')

    if (os.platform() === "win32") return
    setInterval(() => {
        const cpuUsage = os.loadavg()[0]
        mainWindow.webContents.send('cpu-usage', cpuUsage.toFixed(2))
    }, 1000);

    setInterval(() => {
        const ramUsage = os.freemem()
        log("info", ramUsage)
        mainWindow.webContents.send("ram-usage", ramUsage)
    }, 1000)

}


app.whenReady().then(() => {
    createWindow()
    log("info", "The application has been started!")

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})


app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
    log("info", "The application has been closed!")
})

