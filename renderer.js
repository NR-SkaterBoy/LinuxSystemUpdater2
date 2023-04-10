/* Import ipcRenderer */
const { ipcRenderer, ipcMain } = require("electron");

setInterval(() => {
    ipcRenderer.send("request-usage");
}, 1000);

ipcRenderer.on("usage-response", (event, data) => {
    document.getElementById("cpu-usage").innerText = `${data.cpuUsage}%`;
    document.getElementById("ram-usage").innerText = `${data.ramUsage}%`;
    document.getElementById("rom-usage").innerText = `${data.romUsage}%`;
    document.getElementById("cpu-name").innerText = data.cpuName
    document.getElementById("uptime").innerText = data.uptime
    document.getElementById("arhitecture").innerHTML = data.arc
    document.getElementById("hostname").innerHTML = data.hostName
    document.getElementById("update-time").innerText = data.lastUpdate
})

document.getElementById("update-btn").addEventListener("click", function() {
    ipcRenderer.send("update")
    console.log("update")
})