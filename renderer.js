const { ipcRenderer } = require('electron');

setInterval(() => {
    ipcRenderer.send('request-usage');
}, 1000);

ipcRenderer.on('usage-response', (event, data) => {
    console.log(data.cpuUsage);
    document.getElementById('cpu-usage').innerText = `${data.cpuUsage}%`;
    document.getElementById('ram-usage').innerText = `${data.ramUsage}%`;
    document.getElementById('rom-usage').innerText = `${data.romUsage}%`;
});
