import dotenv from 'dotenv';
import Constants from '../Creds/Constants.json' assert {type: 'json'};

dotenv.config()

export default function getAuthLink(state) {
    const tenant = process.env.TENANT_ID;
    const client_id = process.env.AZURE_CLIENT_ID;
    const redirect_uri = Constants.authRedirect;
    const scope = "offline_access user.read mail.read";
    const response_type = "code";
    const response_mode = "query";


    const url = new URL(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`);
    url.searchParams.append("client_id", client_id);
    url.searchParams.append("redirect_uri", redirect_uri);
    url.searchParams.append("scope", scope);
    url.searchParams.append("response_type", response_type);
    url.searchParams.append("response_mode", response_mode);
    url.searchParams.append("state", state);

    console.log(url.toString());

    return url.toString();

}

