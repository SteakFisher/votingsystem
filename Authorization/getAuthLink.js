const dotenv = require('dotenv');
const Constants = require('../Creds/Constants.json');

dotenv.config()

module.exports = {
    getAuthLink: function (state) {
        const tenant = process.env.TENANT_ID;
        const client_id = process.env.AZURE_CLIENT_ID;
        const redirect_uri = process.env.AUTH_REDIRECT;
        const scope = Constants.scope;
        const response_type = "code";
        const response_mode = "query";


        const url = new URL(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`);
        url.searchParams.append("client_id", client_id);
        url.searchParams.append("redirect_uri", redirect_uri);
        url.searchParams.append("scope", scope);
        url.searchParams.append("response_type", response_type);
        url.searchParams.append("response_mode", response_mode);
        url.searchParams.append("state", state);

        return url.toString();
    }
}

