import SessionInterface from "./SessionInterface";

export default interface TwoFactorResponseInteface {
    /** A value from EResult. If this is not OK (1), then the request failed. */
    status: number,
    /** This is your secret that's used for two-factor authentication. */
    shared_secret: string,
    /** This is your secret that's used for confirming trades. */
    identity_secret: string,
    /** You will need this in the future to disable two-factor authentication. */
    revocation_code: string,
    serial_number: string;
    uri: string,
    server_time: string,
    account_name: string,
    token_gid: string,
    secret_1: string
}