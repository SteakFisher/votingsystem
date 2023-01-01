const { Router } = require('express')
const Constants = require('../Creds/Constants.json')
const { getUser } = require('../Utils/util.js')
const { sessionUsers, states, redirects } = require("../Utils/cache")

const router = Router()

router.get('/', async (request, response) => {
    // request.url is /?code...... use req.baseUrl
    const reqUrl = request.baseUrl + request.url


    try {
        if (reqUrl.indexOf('/microsoft/auth') > -1) {
            const qs = new URL(reqUrl, process.env.AUTH_REDIRECT).searchParams;

            const state = qs.get('state');

            if (!(states.includes(String(state)))) {
                response.send('State not Equal')
            }

            if (states.includes(String(state))) {
                const code = qs.get('code')

                const params = new URLSearchParams();
                params.append("grant_type", "authorization_code");
                params.append("code", code);
                params.append("client_id", process.env.AZURE_CLIENT_ID);
                params.append("redirect_uri", process.env.AUTH_REDIRECT);
                params.append("client_secret", process.env.AZURE_CLIENT_SECRET);

                fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'scope': Constants.scope,
                    },
                    body: params
                })
                    .then(res => res.json())
                    .then(async json => {
                        sessionUsers[state] = await getUser({
                            access_token: json.access_token,
                            refresh_token: json.refresh_token,
                        })

                        for (let i = 0; i < states.length; i++) {
                            if (states[i] === state) {
                                states.splice(i, 1);
                            }
                        }

                        response.redirect(`/${redirects[state]}?state=${state}`)
                        response.end();
                        delete redirects[state]
                    })
            }
        }
    }
    catch (e) {
        console.log("Then WHAT?")
        console.log(e)
    }
})

module.exports = router