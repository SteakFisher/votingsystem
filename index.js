import express from "express"

import getAuthLink from "./Authorization/getAuthLink.js";
import getAuthTokens from "./Authorization/getAuthTokens.js";

let app = express()

app.set('port', (process.env.PORT || 443))

app.listen(process.env.PORT || 443, function() {
    console.log('App is running, server is listening on port ', app.get('port'));
})

app.get('/', async function(request, response) {
    response.send('hi');
})

// Pass in a unique state string to prevent CSRF attacks, each user is identified by the state u pass in
getAuthLink("1234")


// For each unique "state" passed in a new instance is spun up, forcing each user to have a unique state
// This part MAYBE prone to breaking, so extensive testing is required
console.log(await getAuthTokens("1234", app))
