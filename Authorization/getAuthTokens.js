const fetch = require('node-fetch');

const dotenv = require('dotenv');
const Constants = require('../Creds/Constants.json');
const { getUser } = require("../Utils/getUser")
dotenv.config()

module.exports = {
    getAuthTokens: function (state, app, redirect, sessionUsers) {
        console.log('Function state', state)
        return new Promise((resolve, reject) => {
            app.get('/microsoft/auth', async function (request, response) {


                try {

                    if (request.url.indexOf('/microsoft/auth') > -1) {
                        const qs = new URL(request.url, process.env.AUTH_REDIRECT).searchParams;
                        console.log('Callback Function State', state)
                        console.log('Redirect state', qs.get('state'))
                        if (qs.get("state") !== state) {
                            response.send('State not Equal')
                        }
                        if (qs.get("state") === state) {
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
                                    response.redirect(`/${redirect}?state=${state}`)
                                    response.end();
                                    resolve({
                                        access_token: json.access_token,
                                        refresh_token: json.refresh_token,
                                    });
                                })
                        }
                    }
                } catch (e) {
                    console.log("Then WHAT?")
                    console.log(e)
                }
            })
        })
    }
}


