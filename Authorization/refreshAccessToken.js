import fetch from "node-fetch";
import Constants from "../Creds/Constants.json" assert {type: "json"};


export default async function refreshAccessToken(authObj) {
    const tenant = process.env.TENANT_ID;

    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", authObj.refresh_token);
    params.append("client_id", process.env.AZURE_CLIENT_ID);
    params.append("client_secret", process.env.AZURE_CLIENT_SECRET);

    return await fetch(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'scope': Constants.scope,
        },
        body: params
    })
        .then(res => res.json())
        .then(json => {
            return ({
                access_token: json.access_token,
                refresh_token: authObj.refresh_token,
            });
        })
}