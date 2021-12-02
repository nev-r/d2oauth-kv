import Keyv from "keyv";
import { KeyvFile } from "keyv-file";
import { createOauthHttpClient, setupTokenWithAuthCode as stwac, } from "d2oauth-base";
export function createOauthHttpClientKV(apiKey, client_id, client_secret, kvFileLocation = `./db/d2oauth.json`, options = {}) {
    const oauthStore = new Keyv({
        store: new KeyvFile({
            filename: kvFileLocation,
        }),
    });
    return createOauthHttpClient(apiKey, client_id, client_secret, () => oauthStore.get("token"), (tm) => oauthStore.set("token", tm), options);
}
export function setupTokenWithAuthCode(authorization_code, client_id, client_secret, kvFileLocation = `./db/d2oauth.json`) {
    const oauthStore = new Keyv({
        store: new KeyvFile({
            filename: kvFileLocation,
        }),
    });
    return stwac(authorization_code, client_id, client_secret, (tm) => oauthStore.set("token", tm));
}
