export default interface ChangableSecondaryInterface {
    steam: {
        error: null | string,
        balance: number | null;
        currency: string | null;
    };
    market: {
        error: null | string,
        balance: number | null;
        currency: string | null;
    }
}