import fetch from "node-fetch";
import Constants from "../Creds/Constants.json" assert {type: "json"};

export default function getUserId(authObj){

    console.log(authObj.access_token)

    // I LOVE copilot

    fetch(`https://graph.microsoft.com/beta/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'scope': Constants.scope,
            'Authorization': `Bearer ${authObj.access_token}`
        }
    })
        .then(res => res.json())
        .then(json => {
            console.log(json)
        })
}