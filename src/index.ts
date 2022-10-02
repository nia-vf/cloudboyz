import { OfferIndex } from "./interfaces/offer-index";

console.log("AWS Price API POC!");
const offerIndexURL =
  "https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/index.json";

const getOfferIndexFile = async (): Promise<OfferIndex> => {
  const response = await fetch(offerIndexURL);
  return await response.json();
};

const logOfferIndexFile = async () => {
  try {
    const text = await getOfferIndexFile();
    console.log(text);
  } catch (e) {
    console.log("Error retrieving Index File");
    console.error(e);
  }
};

const getOfferDetailsForService = async (service: string) => {
  console.log(`Getting Offer details for service ... ${service}`);
  const file = await getOfferIndexFile();
  console.log(file.offers[service]);
};

(async () => {
  await getOfferDetailsForService("AmazonLightsail");
})();
