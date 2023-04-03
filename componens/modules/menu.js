/* ======== Application Modules ======== */
const { app, Menu, shell } = require('electron')
const log = require('../logger')

const template = [
    {
        label: 'Menu',
        submenu: [
            {
                label: 'Restart',
                accelerator: 'CmdOrCtrl+N',
                click: () => {
                    app.relaunch()
                    app.quit()
                }
            },
            {
                label: 'Open',
                accelerator: 'CmdOrCtrl+O',
                click: () => {
                    console.log('Open File')
                }
            },
            {
                label: 'Save',
                accelerator: 'CmdOrCtrl+S',
                click: () => {
                    console.log('Save File')
                }
            },
            {
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click: () => {
                    app.quit()
                }
            }
        ]
    },
    {
        label: 'Social',
        submenu: [
            {
                label: 'Website',
                click: () => {
                    shell.openExternal("https://richardneuvald.hu")
                },
            },
            {
                label: 'Instagram',
                click: () => {
                    shell.openExternal("https://instagram.com/richardneuvald")
                },
            },
            {
                label: 'Github',
                click: () => {
                    shell.openExternal("https://github.com/NR-SkaterBoy")
                },
            },
            {
                label: 'PayPal',
                click: () => {
                    shell.openExternal("https://www.paypal.com/paypalme/richardneuvald")
                },
            },
            {
                label: 'BuyMeACoffee',
                click: () => {
                    shell.openExternal("https://www.buymeacoffee.com/richardneuvald")
                },
            }
        ]
    }
]

const createMenu = () => {
    try {
        const menu = Menu.buildFromTemplate(template)
        Menu.setApplicationMenu(menu)
    } catch (e) {
        console.log(e)
        log("error", e)
    }
}

module.exports = { createMenu }