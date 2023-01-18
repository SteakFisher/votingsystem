const { Router } = require('express')
const { getHouse } = require('../Utils/util')
const { sessionUsers, contestants, db } = require("../Utils/cache")

const router = Router()

router.get('/', async (req, res) => {
    const state = req.query.state
    if (state) {
        try {
            const user = sessionUsers[state]
            if (!user) return res.status(404).send({ error: 'No User Found' })
            const house = await getHouse(user.email, db)

            quoteA = contestants.getDetails()[`${house}_Quote_A`]
            quoteB = contestants.getDetails()[`${house}_Quote_B`]
            res.send({ house, quoteA, quoteB })
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: error.message })
        }
    }
    else res.status(400).send({ error: 'No State Provided' })
})

module.exports = router