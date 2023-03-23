/* ======== Application Modules ======== */
const Notifications = require("electron-notifications")
const { Notification } = require('electron')

/**
 * 
 * @param {string} title Title of the notification
 * @param {string} description Description of the notification
 * @param {string} image Path to image
 * @param {string} sound Sound of notification
 */
function createNotification(title, description, image, sound) {
  const notification = new Notification({
    title: title,
    body: description,
    backgroundColor: '#000000',
    color: '#FFFFFF',
    icon: image || "../app*/img/lsu_icon.ico",
    borderRadius: 50,
    sound: sound,
  })

  notification.show()
}

module.exports = {
  createNotification
}
