const { Router } = require('express')

const router = Router()


router.get('/', (request, response) => {
    response.sendFile(path.join(process.cwd(), 'public', 'Home', 'home.html'))
})
router.get('/vote', async (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'Vote', 'vote.html'))
})

router.get('/termsofservice', async function (request, response) {
    response.sendFile(path.join(process.cwd(), 'public', 'termsofservice.html'))
})

router.get('/privacystatement', async function (request, response) {
    response.sendFile(path.join(process.cwd(), 'public', 'privacystatement.html'))
})

router.get('/.well-known/microsoft-identity-association.json', async function (request, response) {
    response.sendFile(path.join(process.cwd(), 'public', 'microsoft-identity-association.json'))
})

module.exports = router