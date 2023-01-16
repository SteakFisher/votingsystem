const path = require('path')
const { Router } = require('express')
const { resetDb } = require('../../Utils/util')
const { adminStates, sessionUsers } = require("../../Utils/cache")
const router = Router()

router.get('/', async (req, res) => {
    const state = req.signedCookies.state
    if (!state) return res.sendStatus(401)
    if (!adminStates.includes(state)) return res.sendStatus(403)
    res.sendFile(path.join(process.cwd(), 'public', 'Admin', 'Reset', 'reset.html'))
})

router.delete('/', async (req, res) => {
    const state = req.body.state
    if (!state) return res.sendStatus(401)
    if (!adminStates.includes(state)) return res.sendStatus(403)
    const user = sessionUsers[state]
    if (!user) return res.sendStatus(500)


    try {
        await resetDb(db)
        res.status(200).send('Database Resetted')
        console.log(`${user.email} resetted Database`)

        console.log
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
        // Sending the Error to them so they can directly report the error
    }

})

module.exports = router