const fetch = require('node-fetch');

const dotenv = require('dotenv');
const Constants = require('../Creds/Constants.json');

dotenv.config()

module.exports = {
    getAuthTokens: function (state, app) {
        return new Promise((resolve, reject) => {
            app.get('/microsoft/auth', async function (request, response) {
                try {

                    if (request.url.indexOf('/microsoft/auth') > -1) {
                        const qs = new URL(request.url, Constants.authRedirect).searchParams;

                        if (qs.get("state") === state) {
                            const code = qs.get('code')
                            response.redirect(`/vote`)
                            response.end();

                            const params = new URLSearchParams();
                            params.append("grant_type", "authorization_code");
                            params.append("code", code);
                            params.append("client_id", process.env.AZURE_CLIENT_ID);
                            params.append("redirect_uri", Constants.authRedirect);
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
                                .then(json => {
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


