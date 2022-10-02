export interface OfferIndex {
    formatVersion: number,
    disclaimer: string,
    publicationDate: string,
    offers: KVPair,
}

interface KVPair {
    [key: string]: Offer;
 }

export interface Offer {
    offerCode: string,
    currentVersionUrl: string,
    currentVersionIndexUrl: string,
    savingsPlanVersionIndexUrl: string,
}