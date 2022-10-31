import Keyv from "keyv";
import { KeyvFile } from "keyv-file";
import { createOauthHttpClient, looksLikeBnetAuthToken, setupTokenWithAuthCode as stwac, } from "d2oauth-base";
const defaultPath = `./db/d2oauth.json`;
const tokenStorageKey = "token";
export function createOauthHttpClientKV(apiKey, client_id, client_secret, kvFileLocation = `./db/d2oauth.json`, options = {}) {
    const oauthStore = new Keyv({
        store: new KeyvFile({
            filename: kvFileLocation,
        }),
    });
    return createOauthHttpClient(apiKey, client_id, client_secret, () => oauthStore.get(tokenStorageKey), (tm) => oauthStore.set(tokenStorageKey, tm), options);
}
export async function setupTokenWithAuthCode(authorization_code, client_id, client_secret, kvFileLocation = `./db/d2oauth.json`) {
    const store = new KeyvFile({
        filename: kvFileLocation,
    });
    const oauthStore = new Keyv({ store });
    await stwac(authorization_code, client_id, client_secret, (tm) => oauthStore.set(tokenStorageKey, tm));
    await store.saveToDisk();
}
export async function injectExistingBungieNetToken(
/** a valid existing token, which we'll now start refreshing through this instance */
token, kvFileLocation = `./db/d2oauth.json`, 
/** force this to be written into token storage as the new token, even if one already exists */
forceOverwrite) {
    const store = new KeyvFile({
        filename: kvFileLocation,
    });
    const oauthStore = new Keyv({ store });
    if (!looksLikeBnetAuthToken(token)) {
        console.error(token);
        throw `this doesn't look like a token`;
    }
    const tokenMeta = {
        token,
        expires_at: 0,
        refresh_expires_at: Date.now() + token.refresh_expires_in * 1000,
    };
    // bail if there's already a token and overwrite isn't set
    if ((await oauthStore.get(tokenStorageKey)) && !forceOverwrite)
        return;
    await oauthStore.set(tokenStorageKey, tokenMeta);
    await store.saveToDisk();
}
export async function isBungieNetTokenAlreadySet(kvFileLocation = `./db/d2oauth.json`) {
    const oauthStore = new Keyv({
        store: new KeyvFile({
            filename: kvFileLocation,
        }),
    });
    if (await oauthStore.get(tokenStorageKey))
        return true;
    return false;
}
