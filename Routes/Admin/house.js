const path = require('path')
const fs = require('fs')
const { Router } = require('express')
const { getData } = require('../../Scraper/getData')
const { structureData } = require('../../Scraper/structureData')

const { adminStates, sessionUsers } = require("../../Utils/cache")
const router = Router()

router.get('/', async (req, res) => {
    const state = req.signedCookies.state
    if (!state) return res.sendStatus(401)
    if (!adminStates.includes(state)) return res.sendStatus(403)
    res.sendFile(path.join(process.cwd(), 'public', 'Admin', 'House', 'house.html'))

})

router.post('/', async (req, res) => {
    const state = req.body.state
    if (!state) return res.sendStatus(401)
    if (!adminStates.includes(state)) return res.sendStatus(403)
    const user = sessionUsers[state]
    if (!user) return res.sendStatus(500)

    const files = req.files

    const fileKeys = Object.keys(req.files)
    const errors = []
    for (const key of fileKeys) {
        const file = files[key]
        const dest = path.join(process.cwd(), 'Scraper', file.name)
        file.mv(dest, (err) => {
            if (err) {
                errors.push(err.message)
                console.log(err)
            } // Error 
        })
    }
    const usernamesPath = `../Scraper/${files.usernames.name}`
    const houseListPath = `../Scraper/${files.houselist.name}`

    const [students, scraperErrors] = structureData(getData(usernamesPath),
        getData(houseListPath))

    errors.concat(scraperErrors)

    res.send({ msg: 'Success', errors: errors.toString() })
    console.log(`${user.email} updated Username and HouseList`)

    for (const student of students) {
        await addUser(student)
    }
    fs.unlinkSync(usernamesPath)
    fs.unlinkSync(houseListPath)

})

module.exports = router