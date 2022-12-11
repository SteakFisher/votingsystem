import fetch from "node-fetch";
import Constants from "../Creds/Constants.json" assert {type: "json"};

export default async function getUser(authObj) {

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
                usageLocation: json.usageLocation
            }
        })
}