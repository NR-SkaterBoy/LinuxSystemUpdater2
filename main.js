/* ======== Application Modules ======== */
const { app, BrowserWindow, ipcMain, autoUpdater } = require("electron")

/* ======== Import Modules ======== */
const path = require("path")
const os = require("os")

/* ======== Custom Modules ======== */
const log = require("./componens/logger")
const { createMenu } = require("./componens/modules/menu")
const { createNotification } = require("./componens/utils")


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

app.setName("Linux System Updater")
console.log(app.name)

// TODO: Ha nincs internek kapcsolat, ne induljon el, és térjen vissza egy error üzenettel
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
    provider: 'github',
    owner: 'NR-SkaterBoy',
    repo: 'https://github.com/NR-SkaterBoy/LinuxSystemUpdater2',
    releaseType: 'release',
    prerelease: false,
    private: true,
    token: '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'
});

app.whenReady().then(() => {
    autoUpdater.checkForUpdatesAndNotify().then((result) => {
        if (result.updateInfo && result.updateInfo.version) {
            autoUpdater.downloadUpdate();
        }
    }).catch((error) => {
        if (error.code === 'ERR_UPDATER_INVALID_RELEASE_FEED') {
            console.error(error);
            createNotification({
                title: 'Update error',
                body: 'An error occurred during the update. Please try again later.',
                icon: 'src/img/error.png',
                sound: './src/sound/error.mp3',
                silent: true
            });
        }
    });
});

autoUpdater.on('update-downloaded', (info) => {
    log("info", 'update-downloaded');
    createNotification({
        title: "Successful update",
        body: "We have successfully updated the application!",
        icon: "./src/img/succesfull.png",
        sound: "./src/sound/succes.mp3",
        silent: true
    })
    autoUpdater.quitAndInstall(true, true);
});

autoUpdater.on('error', (err) => {
    log("error", err);
    console.log(err)
});
