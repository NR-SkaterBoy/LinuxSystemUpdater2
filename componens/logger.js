/* ======== Import Modules ======== */
const { createLogger, transports, format } = require("winston")
const { combine, timestamp, printf } = format
const os = require("os")
const fs = require("fs")
const path = require("path")

const pathLocation = "./logs"

const logFilePath = path.join(pathLocation, "logs.log");
const logFolder = "logs/logs"

try { if (!fs.existsSync(logFolder)) fs.mkdirSync(logFolder) } catch (e) { console.log(e) }

const loggerConfig = {
    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        printf(info => `${info.timestamp} [${info.level.toUpperCase()}] - ${info.message}`)
    ),
    transports: [
        new transports.File({
            filename: logFilePath,
            level: process.env.LOG_LEVEL || "debug",
            format: combine(
                timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                printf(info => `${info.timestamp} [${info.level.toUpperCase()}] - ${info.message}`)
            )
        })
    ]
}

const loggerInstance = createLogger(loggerConfig)

/**
 * Function of the log types
 * @param {"error" | "warn" | "info" | "debug"} [level="info"] Types of log. The default is "info"
 * @param {string} message Message
 */

function log(level = "info", message) {
    if (level === "error") loggerInstance.error(message)
    else if (level === "warn") loggerInstance.warn(message)
    else if (level === "debug") loggerInstance.debug(message)
    else loggerInstance.info(message)
}

module.exports = log;