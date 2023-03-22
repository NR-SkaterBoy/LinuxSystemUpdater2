const { ipcRenderer } = require('electron');
const memoryUsageDiv = document.getElementById('memory-usage');

// Először kérje el az adatokat a memóriahasználatról a főfolyamattól
ipcRenderer.send('get-memory-usage');

// Fogadja az IPC üzeneteket a főfolyamattól és jelenítse meg az adatokat
ipcRenderer.on('memory-usage', (event, percentUsed) => {
    memoryUsageDiv.innerHTML = `${percentUsed}%`;
});