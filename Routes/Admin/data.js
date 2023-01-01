const path = require('path')
const { Router } = require('express')

const { getVoteData } = require('../../Utils/util')
const { adminStates, db } = require("../../Utils/cache")
const router = Router()

router.get('/', async (req, res) => {
    const state = req.signedCookies.state
    if (!state) return res.sendStatus(401)
    if (!adminStates.includes(state)) return res.sendStatus(403)
    res.sendFile(path.join(process.cwd(), 'public', 'Admin', 'Data', 'data.html'))
})

router.get('/getData', async (req, res) => {
    const state = req.signedCookies.state
    if (!state) return res.sendStatus(401)
    if (!adminStates.includes(state)) return res.sendStatus(403)
    const data = await getVoteData(db)

    // To remove the array of emails
    // Would be a shitton of data which isn't used for now
    // Idk if there's a better way to do this 
    const voteCount = {}
    const houses = ['Jupiter', 'Mars', 'Saturn', 'Neptune']
    for (const house of houses) {
        voteCount[house] = {}
        for (key of Object.keys(data[house])) {
            if (key.includes('count')) {
                voteCount[house][key] = data[house][key]
            }
        }
    }
    res.send(voteCount)
})

module.exports = router