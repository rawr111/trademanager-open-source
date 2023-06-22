interface LinksInterface {
    steamAccounts: {
        [id: string]: string | null
    },
    profiles: {
        [id: string]: { steamAccountId: string | null, proxyId: string | null }
    }
}

export default LinksInterface;