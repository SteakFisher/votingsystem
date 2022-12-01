const express = require('express');
const fetch = require("node-fetch");

module.exports = {
    getAuthCode: function (app) {

        app.get('/', function (req, res) {

            // Get the authorization code from the request
            let code = req.query.code;
            // If there is no authorization code, return an error
            if (!code) {
                console.log('Missing authorization code');
                return;
            }
            // If there is an authorization code, return it
            console.log(code);

            const params = new URLSearchParams();
            params.append("grant_type", "authorization_code");

            fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
                method: 'POST',
                headers: {
                    'client_id': 'ac3ab9b4-c18c-462f-a32a-8034d3c73760',
                    'redirect_uri': 'http://localhost/',
                    'client_secret': 'rbj8Q~CFTQFAy_raLkVdz1yQ3DAbLGjnPp7H-dBT',
                    'scope': 'user.read',
                },
                body: params
            })
                .then(res => res.json())
                .then(json => console.log(json));


        })

    }
}