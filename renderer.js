const { ipcRenderer } = require("electron");

setInterval(() => {
    ipcRenderer.send("request-usage");
}, 1000);

ipcRenderer.on("usage-response", (event, data) => {
    console.log(data.cpuUsage);
    document.getElementById("cpu-usage").innerText = `${data.cpuUsage}%`;
    document.getElementById("ram-usage").innerText = `${data.ramUsage}%`;
    document.getElementById("rom-usage").innerText = `${data.romUsage}%`;
    document.getElementById("cpu-name").innerText = data.cpuName
    document.getElementById("uptime").innerText = data.uptime
    document.getElementById("last-update").innerHTML = data.lastUpdate || ""
})