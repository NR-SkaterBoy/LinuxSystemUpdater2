/* ======== Application Modules ======== */
const { app, BrowserWindow, dialog, ipcMain } = require("electron")
const { autoUpdater, AppUpdater } = require("electron-updater");

/* ======== Import Modules ======== */
const path = require("path")
const os = require("os")
const dns = require("dns");

/* ======== Custom Modules ======== */
const log = require("./componens/logger")
const { createMenu } = require("./componens/modules/menu")
const { createNotification } = require("./componens/utils")
const { ipcRender } = require("./componens/modules/functions");
const { exec } = require("child_process");

/**
 * It creates the main window with menu
 */
function createWindow() {
    createMenu() // Creates custom menu
    ipcRender() // Load IPC function
    try {
        const mainWindow = new BrowserWindow({
            width: 1418,
            height: 733,
            resizable: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
                devTools: true,
                preload: path.join(__dirname, "preload.js")
            },
            icon: "src/icon.png",
        })
        mainWindow.loadFile("./app/index.html") // Loads index file
    } catch (e) {
        console.log(e)
        log("error", e)
    }
}

app.setName("Linux System Updater")

/* Starts application when it is ready */
app.whenReady().then(() => {
    autoUpdater.checkForUpdates()
    try {
        dns.resolve("www.google.com", function (err) {
            if (err) {
                log("error", `No available intrernet connection\t${err}`)
                /**
                 * TODO: Write better UI box
                 * Probably custom dialogbox
                 * Communicate between back-frontend
                 */
                dialog.showMessageBox({
                    type: "error",
                    title: "Error occured!",
                    message: "Check your network connection!",
                    buttons: ["Try Again", "Quit"],
                    backgroundColor: '#000000',
                    frame: true,
                    titleBarStyle: 'hiddenInset',
                    height: 200,
                    width: 400,
                    resizable: false,
                    thickFrame: true,
                    webPreferences: {
                        nodeIntegration: true,
                        contextIsolation: false
                    }
                }).then(result => {
                    if (result.response === 0) {
                        app.relaunch()
                    } else app.quit()
                })
            } else {
                createWindow()
                log("info", `The application has been started! Verison: ${app.getVersion()}`)
                autoUpdater.checkForUpdates().then((res) => {
                    if (res && res.updateInfo) {
                        console.log(res.updateInfo);
                        log("info", res.updateInfo)
                    } else {
                        console.log("No update info available.");
                        log("info", "No update info available.")
                    }
                });
                app.on("activate", function () {
                    if (BrowserWindow.getAllWindows().length === 0) {
                        createWindow()
                        autoUpdater.checkForUpdates()
                    }
                })
            }
        })
    } catch (e) {
        console.log(e)
        log("error", e)
    }
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
    prerelease: true,
    private: false,
    token: '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',
    url: 'https://api.github.com/repos/NR-SkaterBoy/LinuxSystemUpdater-releases/releases',
});


autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true

function showUpdateAvailable(version) {
    dialog.showMessageBox({
        type: "info",
        title: "Update available",
        message: `Version ${version} is now available. Do you want to update?`,
        buttons: ["Update", "No"]
    }).then(result => {
        if (result.response === 0) {
            autoUpdater.downloadUpdate();
        }
    });
}

function showUpdateDownloaded() {
    dialog.showMessageBox({
        type: "info",
        title: "Update downloaded",
        message: "The update has been downloaded. It will be installed on app restart.",
        buttons: ["Restart now", "Later"]
    }).then(result => {
        if (result.response === 0) {
            autoUpdater.quitAndInstall();
        }
    });
}

autoUpdater.on("update-available", (info) => {
    console.log("Update available");
    log("info", "Update available")
    createNotification({
        title: "Update available",
        body: "The update is available!",
        icon: "./src/img/update.png",
        silent: true
    })
    showUpdateAvailable(info.version);
});

autoUpdater.on("update-not-available", () => {
    console.log("No update available");
    log("info", "No update available")
    createNotification({
        title: "No update available",
        body: "There is not update available",
        icon: "./src/img/no-update.png",
        silent: true
    })
});

autoUpdater.on("update-downloaded", () => {
    createNotification({
        title: "Update downloaded",
        body: "Update has been succesfully downloaded!",
        icon: "./src/img/download.png",
        silent: true
    })
    log("info", "Update downloaded")
    showUpdateDownloaded();
})

autoUpdater.on("error", () => {
    createNotification({
        title: "Update failed!",
        body: "Error occured during the update!",
        icon: "./src/img/update-error.png"
    })
    log("error", "Update failed")
})

ipcMain.on("update", (event) => {
    try {
        exec(`. /etc/os-release
        echo "" | tee -a $HOME/lsuLog/update.log
        echo "" | tee -a $HOME/lsuLog/update.log
        echo "" | tee -a $HOME/lsuLog/update.log
        echo $(date +" %A, %d of %B") | tee -a $HOME/lsuLog/update.log
        case "$ID_LIKE" in
            "debian")
                x-terminal-emulator -e bash -c "
                    echo -e '\\033[32mRunning apt update...\\033[0m'; sudo apt update | tee -a $HOME/lsuLog/update.log;
                    echo -e '\\033[32mRunning apt upgrade...\\033[0m'; sudo apt upgrade -y | tee -a $HOME/lsuLog/update.log;
                    echo -e '\\033[32mRunning apt autoremove...\\033[0m'; sudo apt autoremove -y | tee -a $HOME/lsuLog/update.log;
                    echo -e '\\033[32mRunning apt fix-broken install...\\033[0m'; sudo apt --fix-broken install | tee -a $HOME/lsuLog/update.log;
                    read -p $'\\033[36mPress [ENTER] key to exit.\\033[0m'
                "
                ;;
            *)
                echo "\\033[31mError: Update failed! Unsupported system!\\033[0m"
                ;;
        esac`)
    } catch (e) {
        log("error", `Error${e}`)
        console.log("Error",e)
    }
})
