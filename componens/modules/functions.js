/**
 * Checks internet connection and return boolean
 */
const dns = require('dns');
function checkInternetConnection() {
    try {
        dns.lookupSync('https://google.com');
        return true;
    } catch (err) {
        return false;
    }
}

module.exports = checkInternetConnection