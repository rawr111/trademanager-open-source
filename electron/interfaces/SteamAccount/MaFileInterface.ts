import SessionInterface from './SessionInterface';

export default interface MaFileInterface {
    shared_secret: string;
    serial_number: string;
    revocation_code: string;
    uri: string;
    server_time: string;
    account_name: string;
    token_gid: string;
    identity_secret: string;
    secret_1: string;
    status: number;
    device_id: string;
    fully_enrolled: boolean;
    Session: SessionInterface
}