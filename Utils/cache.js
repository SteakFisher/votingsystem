const { authenticateFirestore } = require("../Authorization/authenticateFirestore")

module.exports = {
    db: authenticateFirestore(),
    contestants: {
        details: require('../public/contestants.json'),
        getDetails() {
            return this.details
        },
        setDetails(updated) {
            this.details = updated
        }
    },
    adminStates: [],
    states: [],
    redirects: {},
    sessionUsers: {},
    voted: [],
}

