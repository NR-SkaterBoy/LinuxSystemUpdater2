const { Notification } = require('electron')

/**
 * Creates a notification
 * @param {Object} data Data of the notification
 * @returns {Notification} notification
 */
exports.createNotification = (data = {}) => {
    const notification = new Notification({
        title: data.title || '',
        subtitle: data.subtitle || '',
        body: data.body || '',
        silent: data.silent || false,
        icon: data.icon || '',
        hasReply: data.hasReply || false,
        timeoutType: data.timeoutType || '',
        replyPlaceholder: data.replyPlaceholder || '',
        sound: data.sound || '',
        urgency: data.urgency || '',
        actions: data.actions || [],
        closeButtonText: data.closeButtonText || '',
        toastXml: data.toastXml || ''
    })
    return notification.show()
}
