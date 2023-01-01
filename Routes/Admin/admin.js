const { Router } = require('express')

const { adminStates, sessionUsers } = require("../../Utils/cache")
const router = Router()

router.get('/', async (req, res) => {
    const state = req.query.state || req.signedCookies.state
    if (!state) return res.redirect('/admin/login')

    const user = sessionUsers[state]
    if (!user) return res.status(500).send('No Session Found')

    try {
        const mail = user.email
        if (admins.includes(mail)) {
            adminStates.push(state)
            res.cookie('state', state, { signed: true })
                .sendFile(path.join(process.cwd(), 'public', 'Admin', 'admin.html'))
        }
        else res.sendStatus(401)

    } catch (error) {
        res.sendStatus(500)
        console.log(error)
    }
})

router.get('/login', async (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'Admin', 'login.html'))
})
module.exports = router