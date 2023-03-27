/* ======== Application Modules ======== */
const { app, BrowserWindow, dialog } = require("electron")
const { autoUpdater, AppUpdater } = require('electron-updater');

/* ======== Import Modules ======== */
const path = require("path")
const os = require("os")
const dns = require("dns");

/* ======== Custom Modules ======== */
const log = require("./componens/logger")
const { createMenu } = require("./componens/modules/menu")
const { createNotification } = require("./componens/utils")
const { ipcRender } = require("./componens/modules/functions");

/**
 * It creates the main window with menu
 */
function createWindow() {
    const menu = os.platform() == "win32" ? "" : createMenu() // Define menu
    const mainWindow = new BrowserWindow({
        width: 1418,
        height: 933,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            devTools: true,
            preload: path.join(__dirname, "preload.js")
        },
        icon: "./app/img/lsu_icon.ico",
    })
    mainWindow.loadFile("./app/index.html") // Loads index file
    ipcRender() // Load IPC function
}

app.setName("Linux System Updater")

/* Starts application when it is ready */
app.whenReady().then(() => {
    dns.resolve('www.google.com', function (err) {
        if (err) {
            console.log("No available intrernet connection")
            log("error",  `No available intrernet connection\t${err}`)
            dialog.showMessageBox({
                type: 'info',
                title: 'Error occured!',
                message: 'Check your network connection!',
                buttons: ['Try Again', 'Quit']
            }).then(result => {
                if (result.response === 0) {
                    app.relaunch()
                } else app.quit()
            });
        } else {
            console.log("Connected");
            createWindow()
            log("info", "The application has been started!")
            app.on("activate", function () {
                if (BrowserWindow.getAllWindows().length === 0) createWindow()
            })
            autoUpdater.checkForUpdates()
        }
    });
})

/* Closed application  */
app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit()
    log("info", "The application has been closed!")
})

/* Updater */
autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'NR-SkaterBoy',
    repo: 'LinuxSystemUpdater-releases',
    releaseType: 'release',
    prerelease: false,
    private: false,
    token: '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',
    url: 'https://api.github.com/repos/NR-SkaterBoy/LinuxSystemUpdater-releases/releases',
});

autoUpdater.autoDownload = true
autoUpdater.autoInstallOnAppQuit = true

function showUpdateAvailable(version) {
    dialog.showMessageBox({
        type: 'info',
        title: 'Update available',
        message: `Version ${version} is now available. Do you want to update?`,
        buttons: ['Update', 'No']
    }).then(result => {
        if (result.response === 0) {
            autoUpdater.downloadUpdate();
        }
    });
}

function showUpdateNotAvailable() {
    dialog.showMessageBox({
        type: 'info',
        title: 'No update available',
        message: `You have the latest version of the app (${app.getVersion()}).`,
        buttons: ['OK']
    });
}

function showUpdateDownloaded() {
    dialog.showMessageBox({
        type: 'info',
        title: 'Update downloaded',
        message: 'The update has been downloaded. It will be installed on app restart.',
        buttons: ['Restart now', 'Later']
    }).then(result => {
        if (result.response === 0) {
            autoUpdater.quitAndInstall();
        }
    });
}

autoUpdater.on('update-available', (info) => {
    console.log('Update available');
    showUpdateAvailable(info.version);
});

autoUpdater.on('update-not-available', () => {
    console.log('No update available');
    showUpdateNotAvailable();
});

autoUpdater.on('update-downloaded', () => {
    console.log('Update downloaded');
    showUpdateDownloaded();
});