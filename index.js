const express = require("express")
const path = require("path")


const { getAuthLink } = require("./Authorization/getAuthLink.js")
const { getAuthTokens } = require("./Authorization/getAuthTokens.js")
const { getUser } = require("./Utils/getUser.js")
const { authenticateFirestore } = require("./Authorization/authenticateFirestore.js")
const { addVote } = require("./Utils/addVote.js")
const { hasVoted } = require("./Utils/hasVoted.js")
const { getHouse } = require("./Utils/getHouse.js")

let sessionUsers = {};
let voted = [] // Array of emails of users who have voted

let app = express()

app.set('port', (process.env.PORT || 443))

app.use(express.json())
app.use(express.static('public'))

app.listen(process.env.PORT || 443, function () {
    console.log('App is running, server is listening on port ', app.get('port'));
})

app.get('/getLink', async (req, res) => {
    const state = req.query.state
    if (state) {
        const url = getAuthLink(state)
        res.send({ url })

        let authObj = await getAuthTokens(state, app)
        sessionUsers[state] = await getUser(authObj)
        // Store AuthUser

    } else res.status(400).send('No State Provided')

})

app.get('/getHouse', async (req, res) => {
    const state = req.query.state
    if (state) {
        try {
            const house = await getHouse(state)
            res.send({ house })
        } catch (error) {
            console.log(error)
            res.status(500).send({ msg: 'Couldnt Fetch House' })
        }
    }
    else res.status(400).send({ msg: 'No State Provided' })
})


app.get('/vote', async (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'vote.html'))
})

app.post('/addvote', async (req, res) => {
    const { state, contestant } = req.body

    if (state && contestant) {
        try {
            const user = sessionUsers[state]
            const bool = await hasVoted(user, voted, db)
            if (!bool) {
                const house = await getHouse(user)
                await addVote(house, contestant, user, db, voted)
                delete sessionUsers[state]
                res.send('Vote Success')
            }

            else res.status(403).send('Not Again')

        } catch (error) {
            console.log(error)
            res.status(500).send('Server errrrrrrr')
        }

    } else res.status(400).send('Invalid Body')
})
app.get('/', async function (request, response) {
    response.sendFile(path.join(process.cwd(), 'public', 'home.html'))
})

app.get('/termsofservice', async function (request, response) {
    response.sendFile(path.join(process.cwd(), 'public', 'termsofservice.html'))
})

app.get('/privacystatement', async function (request, response) {
    response.sendFile(path.join(process.cwd(), 'public', 'privacystatement.html'))
})

app.get('/.well-known/microsoft-identity-association.json', async function (request, response) {
    response.sendFile(path.join(process.cwd(), 'public', 'microsoft-identity-association.json'))
})

const db = authenticateFirestore();

// Pass in a unique state string to prevent CSRF attacks, each user is identified by the state u pass in
// getAuthLink('1234')
// Returns a URL that you can redirect the user to, for them to authenticate with Microsoft


// For each unique "state" passed in a new instance is spun up, forcing each user to have a unique state
// This part MAYBE prone to breaking, so extensive testing is required
// let authObj = await getAuthTokens("1234", app)
// Returns an object with the access token and refresh token (henceforth referred to as authObj)

// This is the part that refreshes the access token
// Access tokens may expire, so wrap each req in a try catch block and refresh the access token if it fails
// console.log(await refreshAccessToken(authObj));
// Returns an object with the new access token and refresh token


// This is the part that gets the user's Microsoft id (along with other info)
// Pass in authObj containing the access token
// console.log(await getUser(authObj))
// Returns an object with the user's Microsoft id, name, email, usageLocation


// This is the part that adds the vote to the database
// Pass in the house, contestant, user, and doc
// House should be the house name with the first letter capitalized, ex: "Mars"
// Contestant should be either contestant A or contestant B
// User should be the user object returned from getUser
// Db should also be passed in
// addVote("Mars", "contestant A", await getUser(authObj), db, voted);
// void, returns nothing


// This is the part that resets the database
// Pass in the db
// await resetDb(db)


// This is the part that checks if the user has voted
// Pass in the user object returned from getUser and the array of emails of users who have voted
// console.log(await hasVoted(await getUser(authObj), voted, db))
// Returns a boolean, true if the user has voted, false if they haven't
// Feel like I haven't tested properly.. but it should work
