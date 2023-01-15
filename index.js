const express = require("express")
const compression = require('compression')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload');

const { cookieSecret } = require('./Creds/Constants.json')

// api
// Prolly a shorter way to do this but /shrug
const files = require('./api/files')
const getHouse = require('./api/getHouse')
const addVote = require('./api/addVote')
const admin = require('./api/Admin/admin')
const adminHouse = require('./api/Admin/house')
const adminElection = require('./api/Admin/election')
const adminReset = require('./api/Admin/reset')
const adminData = require('./api/Admin/data')

let app = express()

app.set('port', (process.env.PORT || 443))
app.use(compression())
app.use(fileUpload({ useTempFiles: true }));
app.use(cookieParser(cookieSecret))
app.use(express.json())
app.use(express.static('public'))

app.listen(process.env.PORT || 443, function () {
    console.log('App is running, server is listening on port ', app.get('port'));
})

app.use('/getHouse', getHouse)
app.use('/addVote', addVote)
app.use('/admin', admin)
app.use('/admin/house', adminHouse)
app.use('/admin/election', adminElection)
app.use('/admin/reset', adminReset)
app.use('/admin/data', adminData)
app.use('/', files)

// Deleted getAuthTokens

// All Endpoints have their own files
// Made util.js which exports all the functions in Util cuz im too lazy to import every file seperately
// Made cache.js and put the global variables in there so they be accessed in the Route code
// Needs Testing
// Code looks clean ig but shitton of folders

// Add this to the Wiki
// House Pictures need to be 500x500 for new elections
// Could prolly use a library to do that but no.

// We add some library that compiles the html css and js and sends it to the client
// if it exist




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


// Scrapes the excel sheets containing the data of the user, data formats are defined in the wiki
// getData('./Scraper/12C Usernames.xlsx')
// Returns an array of objects, each object is a user's data

// Structures the data into a format that can be added to the database
// Pass in the array of objects returned from getData
// First arg should be Usernames file, 2nd should be House file, data formats defined in the wiki
// let students = structureData(getData('./Scraper/12C Usernames.xlsx'), getData('./Scraper/12C-Houselist.xls'))
//  structureData(getData('./Scraper/12C Usernames.xlsx'), getData('./Scraper/12C-Houselist.xls'))
// Returns an array of 2 items, final array of objects and errors

// Adds the user to the database
// Pass in the user object returned by the structureData function and the db
// addUser({
//     'User': 'Gil',
//     'House': 'Jupiter',
//     'Adm. No.': '2345',
//     'Name': 'Gil',
//     'Class': 12,
//     'Section': 'C'
// }, db)

// async function addUsers() {
//     for (let i = 0; i < students[0].length; i++) {
//         await addUser(students[0][i], db)
//     }
// }
// addUsers().then(r => console.log('Done'))

// getHouse('jayadeep.c_oob@gemselearning.com', db)
