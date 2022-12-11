import express from "express"
import path from "path"


import getAuthLink from "./Authorization/getAuthLink.js";
import getAuthTokens from "./Authorization/getAuthTokens.js";
import refreshAccessToken from "./Authorization/refreshAccessToken.js";
import getUser from "./Utils/getUser.js";
import authenticateFirestore from "./Authorization/authenticateFirestore.js";
import addVote from "./Utils/addVote.js";

let app = express()

app.set('port', (process.env.PORT || 443))

app.use(express.static('public'))

app.listen(process.env.PORT || 443, function () {
    console.log('App is running, server is listening on port ', app.get('port'));
})

app.get('/getLink', (req, res) => {
    const url = getAuthLink(req.query.state)
    res.send({ url })
})

app.get('/home', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'home.html'))
})

app.get('/', async function (request, response) {
    response.send('hi');
})

const db = authenticateFirestore();
let doc = await db.doc(`Houses/${house}`);


// Pass in a unique state string to prevent CSRF attacks, each user is identified by the state u pass in

// Returns a URL that you can redirect the user to, for them to authenticate with Microsoft


// For each unique "state" passed in a new instance is spun up, forcing each user to have a unique state
// This part MAYBE prone to breaking, so extensive testing is required
let authObj = await getAuthTokens("1234", app)
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
// Doc should also be passed in
addVote("Mars", "contestant A", await getUser(authObj), doc);
// void, returns nothing

