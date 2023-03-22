/* ======== Application Modules ======== */
const { app, BrowserWindow, ipcMain, Menu } = require("electron")
const { autoUpdater } = require("electron-updater");

/* ======== Import Modules ======== */
const path = require("path")
const os = require("os")

/* ======== Custom Modules ======== */
const log = require("./modules/logger")
const { createMenu } = require("./componens/menu")
const {successedUpdate, failedUpdate} = require("./componens/updatenotification")


function createWindow() {

    createMenu()

    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            preload: path.join(__dirname, "preload.js")
        },
        icon: "./app/img/lsu_icon.ico",
    })

    // Loads the main file
    mainWindow.loadFile("./app/index.html")
}

/* Starts application when it is ready */
app.whenReady().then(() => {
    createWindow()
    log("info", "The application has been started!")
    app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

/* Closed application  */
app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit()
    log("info", "The application has been closed!")
})

/* Updater */
autoUpdater.setFeedURL({
    provider: "github",
    owner: "NR-SkaterBoy",
    repo: "LinuxSystemUpdater2",
    releaseType: "release",
    prerelease: false,
    private: true,
    token: "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"
});

app.on("ready", () => {
    autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on("update-downloaded", (info) => {
    successedUpdate()
    log("info", "The application has been updated")
});

autoUpdater.on('error', (err) => {
    failedUpdate()
    log("error", "Error occured during the update!")
});