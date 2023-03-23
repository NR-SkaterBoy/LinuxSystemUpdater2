import { Notification } from 'electron'

/**
 * Creates a notification
 * @param {Object} data Data of the notification
 * @returns {Notification} notification
 */
export const createNotification = (data: {
    title?: string;
    subtitle?: string;
    body?: string;
    silent?: boolean;
    icon?: string;
    hasReply?: boolean;
    timeoutType?: string;
    replyPlaceholder?: string;
    sound?: string;
    urgency?: string;
    actions?: any[];
    closeButtonText?: string;
    toastXml?: string;
} = {}): Notification => {
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
