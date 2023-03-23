/* ======== Import Modules ======== */
const { createLogger, transports, format } = require('winston');
const { combine, timestamp, printf } = format;
const os = require("os")
const fs = require('fs');
const path = require('path');

const pathLocation = os.hostname() === "Ricsi" && os.platform() === "win32" ? "C:/Users/nrric/OneDrive/Documents/Programozás/LinuxSystemUpdater2/logs" : "/home/"

const logFilePath = path.join(pathLocation, 'logs.log');
const logFolder = "./logs"

try { if (!fs.existsSync(logFolder)) fs.mkdirSync(logFolder) } catch (e) { console.log(e) }

const loggerConfig = {
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(info => `${info.timestamp} [${info.level.toUpperCase()}] - ${info.message}`)
    ),
    transports: [
        new transports.File({
            filename: logFilePath,
            level: process.env.LOG_LEVEL || 'debug',
            format: combine(
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                printf(info => `${info.timestamp} [${info.level.toUpperCase()}] - ${info.message}`)
            ),
        }),
    ],
};

const loggerInstance = createLogger(loggerConfig);

/**
 * Function of the log types
 * @param {"error" | "warn" | "info" | "debug"} [level="info"] Types of log
 * @param {string} message Log message
 */

function log(level = "info", message) {
    if (level === 'error') {
        loggerInstance.error(message);
    } else if (level === 'warn') {
        loggerInstance.warn(message);
    } else if (level === 'info') {
        loggerInstance.info(message);
    } else if (level === 'debug') {
        loggerInstance.debug(message);
    }
}

module.exports = log;