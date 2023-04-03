/* ======== Import Modules ======== */
const { ipcMain, ipcRenderer } = require("electron")
const os = require("os")
const { spawn } = require("child_process");
const log = require("../logger");

/**
 * IPC
 */
function ipcRender() {
    try {
        ipcMain.on('request-usage', (event) => {
            const cpuUsage = Math.round((1 - os.loadavg()[2] / os.cpus().length) * 100);
            const ramUsage = Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100);
            const romUsage = Math.round((1 - os.loadavg()[2] / os.cpus().length) * 100);

            const cpuName = os.cpus().map(m => m.model)[0]

            let ut_sec = os.uptime();
            let ut_min = ut_sec / 60;
            let ut_hour = ut_min / 60;
            ut_sec = Math.floor(ut_sec);
            ut_min = Math.floor(ut_min);
            ut_hour = Math.floor(ut_hour);
            ut_hour = ut_hour % 60;
            ut_min = ut_min % 60;
            ut_sec = ut_sec % 60;
            const uptime = `${ut_hour}:${ut_min}:${ut_sec}`
            /**
             * Implement try-catch (lastUpdate)
             * finally output i Cannot fetch
             */
            let lastUpdate;
            if (os.platform() != "win32") { try { lastUpdate = spawn("grep \"upgrade \" /var/log/dpkg.log | tail -1") } catch (e) { log("error", e) } }

            const arc = os.arch()
            const hostName = os.hostname()

            event.reply('usage-response', { cpuUsage, ramUsage, romUsage, cpuName, uptime, lastUpdate, arc, hostName });
        })
    } catch (e) {
        console.log(e)
        log("error", e)
    }
}

module.exports = { ipcRender };