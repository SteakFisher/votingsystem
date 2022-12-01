import express from "express"

import getAuthLink from "./Authorization/getAuthLink.js";

let app = express()

app.set('port', (process.env.PORT || 443))

app.listen(process.env.PORT || 443, function() {
    console.log('App is running, server is listening on port ', app.get('port'));
})

getAuthLink("1234")
