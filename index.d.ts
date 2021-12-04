import { BungieNetToken } from "d2oauth-base";
import { HttpClient } from "bungie-api-ts/http";
import "cross-fetch/dist/node-polyfill.js";
export declare function createOauthHttpClientKV(apiKey: string, client_id: string, client_secret: string, kvFileLocation?: string, options?: {
    /**
     * always ON, unless explicitly set to false. this backs off increasingly,
     * delaying new api requests as previous ones encounter downtime or throttling responses.
     *
     * this will not automatically retry, the error is still passed upstack.
     * this simply decreases chances of encountering repeated errors.
     */
    responsiveThrottling?: boolean;
    /**
     * if set, this client will abort the request after some time,
     * then run the onTimeout function to notify upstack of what happened
     */
    withAbortTimeout?: {
        timeout: number;
        onTimeout?: (startTime: number, timeout: number) => void;
    };
    /**
     * if set, this client will run the onTimeout function if the request is taking a long time,
     * e.g. generate a "still waiting!" notification
     */
    withWarningTimeout?: {
        timeout: number;
        onTimeout: (startTime: number, timeout: number) => void;
    };
    verbose?: boolean;
}): HttpClient;
export declare function setupTokenWithAuthCode(authorization_code: string, client_id: string, client_secret: string, kvFileLocation?: string): Promise<void>;
export declare function injectExistingBungieNetToken(
/** a valid existing token, which we'll now start refreshing through this instance */
token: BungieNetToken, kvFileLocation?: string, 
/** force this to be written into token storage as the new token, even if one already exists */
forceOverwrite?: boolean): Promise<void>;
