/* Import modules */
const { app, BrowserWindow, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater');
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
        const used = process.memoryUsage().heapUsed;
        const total = os.totalmem();
        const percentUsed = Math.round((used / total) * 100);
        win.webContents.send('memory-usage', percentUsed);
    }, 1000)

}

autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'NR-SkaterBoy',
    repo: 'LinuxSystemUpdater2',
    releaseType: 'release',
    prerelease: false,
    private: true,
    token: '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'
});


app.on('ready', () => {
    autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on('update-downloaded', (info) => {
    // TODO: Az új verzió letöltése befejeződött, itt jeleníthető meg az üzenet a felhasználónak
    log("info", "The application has been updated")
});

autoUpdater.on('error', (err) => {
    // TODO: Hiba történt a frissítési folyamat során, itt jeleníthető meg az üzenet a felhasználónak
    log("error", "Error occured during the update!")
});


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

