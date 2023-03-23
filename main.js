/* ======== Application Modules ======== */
const { app, BrowserWindow, ipcMain } = require("electron")
const { autoUpdater } = require("electron-updater");

/* ======== Import Modules ======== */
const path = require("path")
const os = require("os")

/* ======== Custom Modules ======== */
const log = require("./componens/modules/logger")
const { createMenu } = require("./componens/menu")
const { createNotification } = require("./componens/updatenotification")


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
    autoUpdater.checkForUpdatesAndNotify().then((result) => {
        if (!result.updateInfo.version) return
        autoUpdater.downloadUpdate();
    });
});

autoUpdater.on("update-downloaded", (info) => {
    log("info", "The application has been updated")
    log("info", info)
    createNotification("Successful update", "We have successfully updated the application!", "./src/img/succesfull.png", "./src/sound/succes.mp3")
    autoUpdater.quitAndInstall();
});

autoUpdater.on('error', (err) => {
    log("error", "An error occurred during the update!")
    log("error", err)
    createNotification("Failed update", "An error occurred during the update!", "src/img/error.png", "./src/sound/error.mp3")
});
