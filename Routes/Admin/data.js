const path = require('path')
const { Router } = require('express')

const { getVoteData } = require('../../Utils/util')
const { adminStates, db, contestants } = require("../../Utils/cache")
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
    const voteData = await getVoteData(db)
    const details = contestants.getDetails()

    const data = {}
    const houses = ['Jupiter', 'Mars', 'Saturn', 'Neptune']

    for (const house of houses) {
        data[house] = {}
        data[house]['countA'] = voteData[house]['contestant A count']
        data[house]['countB'] = voteData[house]['contestant B count']
        data[house]['nameA'] = details[`${house}_Name_A`]
        data[house]['nameB'] = details[`${house}_Name_B`]


    }

    res.send(data)
})

module.exports = router