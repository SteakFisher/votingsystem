const { authenticateFirestore } = require("../Authorization/authenticateFirestore")
let states = []
module.exports = {
    getStates: function() {
        console.log(states)
        return states
    },
    addState: function(state) {
        states.push(state)
        console.log(states)
    },
    db: authenticateFirestore(),
    savedQuotes: require('../public/quotes.json'),
    adminStates: [],
    redirects: {},
    sessionUsers: {},
    voted: [],
}