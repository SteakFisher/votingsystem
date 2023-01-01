const { authenticateFirestore } = require("../Authorization/authenticateFirestore")

module.exports = {
    db: authenticateFirestore(),
    savedQuotes: require('../public/quotes.json'),
    adminStates: [],
    states: [],
    redirects: {},
    sessionUsers: {},
    voted: [],
}