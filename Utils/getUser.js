const fetch = require('node-fetch');
const Constants = require('../Creds/Constants.json');

module.exports =
    async function (authObj) {
        // I LOVE copilot

        return await fetch(`https://graph.microsoft.com/beta/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'scope': Constants.scope,
                'Authorization': `Bearer ${authObj.access_token}`
            }
        })
            .then(res => res.json())
            .then(json => {
                return {
                    id: json.id,
                    name: json.displayName,
                    email: json.mail,
                    usageLocation: json.usageLocation,
                    access_token: authObj.access_token,
                    refresh_token: authObj.refresh_token,
                }
            })
    }


