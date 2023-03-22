/* ======== Application Modules ======== */
const { Notification } = require("electron")

// Succesfulled update
const succesUppdate = new Notification({
    title: "SIkeres frissítés",
    body: "Üzenet szövege",
    icon: "/path/to/icon.png"
})

const successedUpdate = () => {
    succesUppdate.show()
}

const failed = new Notification({
    title: "Sikertelen frissítés",
    body: "Üzenet szövege",
    icon: "/path/to/icon.png"
})

const failedUpdate = () => {
    failed.show()
}

module.exports = { successedUpdate, failedUpdate }