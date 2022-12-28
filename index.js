const express = require("express")
const path = require("path")
const fs = require('fs')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload');


const { admins, cookieSecret } = require('./Creds/Constants.json')
const { getAuthLink } = require("./Authorization/getAuthLink.js")
const { getAuthTokens } = require("./Authorization/getAuthTokens.js")

const { authenticateFirestore } = require("./Authorization/authenticateFirestore.js")
const { addVote } = require("./Utils/addVote.js")
const { hasVoted } = require("./Utils/hasVoted.js")
const { getHouse } = require("./Utils/getHouse.js")
const { resetDb } = require("./Utils/resetDb")
const { getData } = require("./Scraper/getData");
const { structureData } = require("./Scraper/structureData");
const { addUser } = require("./Utils/addUser");

let sessionUsers = {};
let savedQuotes = require('./public/quotes.json') // Quotes of Contestants
let voted = [] // Array of emails of users who have voted

let app = express()

app.set('port', (process.env.PORT || 443))

app.use(fileUpload({ useTempFiles: true }));
app.use(cookieParser(cookieSecret))
app.use(express.json())
app.use(express.static('public'))

app.listen(process.env.PORT || 443, function () {
    console.log('App is running, server is listening on port ', app.get('port'));
})

app.get('/getLink', async (req, res) => {

    const state = req.query.state
    const redirect = req.query.redirect
    if (state && redirect) {
        const url = getAuthLink(state)
        res.send({ url })

        await getAuthTokens(state, app, redirect, sessionUsers)

    } else res.status(400).send('No State/Redirect Provided')

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
    const { state, contestant } = req.body // Need to send house aswell

    if (state && contestant) {
        try {
            const user = sessionUsers[state]
            const bool = await hasVoted(user, voted, db)
            if (!bool) {
                const house = await getHouse(user)// We dont confirm the house
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

let adminStates = [] // To Avoid Authencating the state again and again for subpage

app.get('/admin', async (req, res) => {
    const state = req.query.state || req.signedCookies.state
    if (!state) return res.redirect('/admin/login')

    const user = sessionUsers[state]
    if (!user) return res.status(500).send('No Session Found')
    try {
        const mail = user.email
        if (admins.includes(mail)) {
            adminStates.push(state)
            res.cookie('state', state, { signed: true }).sendFile(path.join(process.cwd(), 'public', 'admin.html'))
        }
        else res.sendStatus(401)

    } catch (error) {
        res.sendStatus(500)
        console.log(error)
    }

})

// Add Cookie Auth check whtever
app.get('/admin/login', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'login.html'))
})
app.get('/admin/house', (req, res) => {
    const state = req.signedCookies.state
    if (!state) return res.sendStatus(401)
    if (!adminStates.includes(state)) return res.sendStatus(403)
    res.sendFile(path.join(process.cwd(), 'public', 'house.html'))
})
app.post('/admin/house', async (req, res) => {
    const state = req.state
    if (!state) return res.sendStatus(401)
    if (!adminStates.includes(state)) return res.sendStatus(403)

    const files = req.files

    const fileKeys = Object.keys(req.files)

    for (const key of fileKeys) {
        const file = files[key]
        const dest = path.join(__dirname, 'Scraper', file.name)
        file.mv(dest, (err) => {
            if (err) console.log(err) // Error 
        })
    }
    const [students, errors] = structureData(getData(`./Scraper/${files.usernames.name}`),
        getData(`./Scraper/${files.houselist.name}`))

    res.send({ msg: 'Works', errors })
    for (const student of students) {
        await addUser(student)
    }



})
app.get('/admin/reset', (req, res) => {
    const state = req.signedCookies.state
    if (!state) return res.sendStatus(401)
    if (!adminStates.includes(state)) return res.sendStatus(403)
    res.sendFile(path.join(process.cwd(), 'public', 'reset.html'))
})
app.delete('/admin/reset', async (req, res) => {
    const state = req.body.state
    if (!state) return res.sendStatus(401)
    if (!adminStates.includes(state)) return res.sendStatus(403)
    try {
        await resetDb(db)
        res.status(200).send('Database Resetted')
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message) // Sending the Error to them so they can directly report the error
    }

})
app.get('/admin/election', (req, res) => {
    const state = req.signedCookies.state
    if (!state) return res.sendStatus(401)
    if (!adminStates.includes(state)) return res.sendStatus(403)
    res.sendFile(path.join(process.cwd(), 'public', 'election.html'))
})

app.post('/admin/election', (req, res) => {
    const { state, quotes } = req.body
    if (!state && !quotes) return res.sendStatus(400)
    if (!adminStates.includes(state)) return res.sendStatus(403)

    savedQuotes = quotes

    fs.writeFile('./public/quotes.json', JSON.stringify(quotes), (err) => {
        if (err) console.log(err)
    })

    const files = req.files
    const fileKeys = Object.keys(req.files)

    for (const key of fileKeys) {
        const file = files[key]
        const dest = path.join(__dirname, 'public', 'Contestants', file.name)
        file.mv(dest, (err) => {
            if (err) console.log(err) // Error 
        })
    }

    res.send('Details Updated')
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