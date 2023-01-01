const { Router } = require('express')
const { sessionUsers } = require("../Utils/cache")
const { hasVoted, getHouse, addUser } = require('../Utils/util')
const router = Router()

router.post('/', async (req, res) => {
    const { state, contestant } = req.body

    if (state && contestant) {
        try {
            const user = sessionUsers[state]
            if (!user) return res.status(404).send('Not Found')
            console.log(user)
            const bool = await hasVoted(user, voted, db)
            if (!bool) {
                const house = await getHouse(user.email, db)
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

module.exports = router