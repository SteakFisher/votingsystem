const { redirects, states } = require("../Utils/cache")
const { Router } = require('express')

const { getAuthLink } = require('../Authorization/getAuthLink')


const router = Router()

router.get('/', (req, res) => {
    const state = req.query.state
    const redirect = req.query.redirect || 'vote'
    if (state) {
        redirects[state] = redirect
        const url = getAuthLink(state)
        res.send({ url })
        states.push(state)

    } else res.status(400).send('No State Provided')
})

module.exports = router