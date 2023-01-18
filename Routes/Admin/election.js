const path = require('path')
const { Router } = require('express')
const { adminStates, sessionUsers, contestants } = require("../../Utils/cache")
const fs = require('fs')
const router = Router()

router.get('/', async (req, res) => {
    const state = req.signedCookies.state
    if (!state) return res.sendStatus(401)
    if (!adminStates.includes(state)) return res.sendStatus(403)
    res.sendFile(path.join(process.cwd(), 'public', 'Admin', 'Election', 'election.html'))
})

router.post('/', async (req, res) => {
    const { details, state } = req.body
    if (!state && !quotes && !names) return res.sendStatus(400)
    if (!adminStates.includes(state)) return res.sendStatus(403)
    const user = sessionUsers[state]
    if (!user) return res.sendStatus(500)

    const errors = []

    contestants.setDetails(JSON.parse(details))


    fs.writeFile(path.join(process.cwd(), 'public', 'contestants.json')
        , details, (err) => {
            if (err) {
                errors.push(err.message)
                console.log(err)
            }
        })

    const files = req.files
    const fileKeys = Object.keys(req.files)

    for (const key of fileKeys) {
        const file = files[key]
        const dest = path.join(process.cwd(), 'public', 'Contestants', file.name)
        file.mv(dest, (err) => {
            if (err) {
                errors.push(err.message)
                console.log(err)
            }
        })
    }

    res.send({ msg: 'Details Updated', errors })
    console.log(`${user.email} updated Election Details`)

})

module.exports = router