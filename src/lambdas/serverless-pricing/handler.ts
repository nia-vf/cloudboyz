import { Context } from "aws-lambda";
import { Product } from "../../interfaces/product";
import { PricingAPI } from "../../services/aws/pricing";
import _ from "lodash"

// Commented out as using an alternative inferface/type for events
// interface Query {
//   queries: Map<string, string>;
// }

// new event interface/Type
// now we can reference fields of type Event as event.region / event.instanceType
interface Event {
  region: string;
  instanceType: string;
}

// Interface for the type of record we'll generate
interface Response {
  instanceType?: string;
  location?: string;
  onDemandKey?: string;
  priceDimensionKey?: string;
  pricePerUnit?: string;
}

const lodashUnderscoreImplementation = (pricingResponseArray: Product[]): Response[] => {
  let pricingResponses: Response[] = [];
  _.each(pricingResponseArray, response => {
    let res: Response = {};
    res.instanceType = response.product?.attributes?.instanceType;
    res.location = response.product?.attributes?.location;
    for (const [onDemandKey, onDemandValue] of _.entries(response.terms?.OnDemand)) {
      for (const [priceDimensionKey, priceDimensionValue] of _.entries(onDemandValue.priceDimensions)) {
        res.onDemandKey = onDemandKey;
        res.priceDimensionKey = priceDimensionKey;
        res.pricePerUnit = priceDimensionValue.pricePerUnit?.USD;
    }
    pricingResponses = [...pricingResponses, res];
  }})
  return pricingResponses
}

const forEachImplementation = (pricingResponseArray: Product[]): Response[] => {
  let pricingResponses: Response[] = [];

  pricingResponseArray.forEach((response) => {
    // for each response build up a single Response interface object to store in pricingResponses array
    let res: Response = {};
    if (response.product?.attributes) {
      res.instanceType = response.product.attributes.instanceType;
      res.location = response.product.attributes.location;
      if (response.terms?.OnDemand) {
        for (const [onDemandKey, onDemandValue] of Object.entries(
          response.terms?.OnDemand
        )) {
          if (onDemandValue.priceDimensions) {
            for (const [
              priceDimensionKey,
              priceDimensionValue,
            ] of Object.entries(onDemandValue.priceDimensions)) {
              res.onDemandKey = onDemandKey;
              res.priceDimensionKey = priceDimensionKey;
              res.pricePerUnit = priceDimensionValue.pricePerUnit?.USD;
            }
          }
        }
      }
      pricingResponses = [...pricingResponses, res];
    }
  });
  return pricingResponses
}

exports.handler = async function (event: Event, context: Context) {
  console.log("Event", event);

  var filtersMap = new Map<string, string>();
  filtersMap.set("regionCode", event.region);
  filtersMap.set("instanceType", event.instanceType);

  const pricingApi = new PricingAPI({ region: "us-east-1", maxAttempts: 2 });
  const pricingResponseArray = await pricingApi.getProducts(filtersMap);
  // DEBUG LINE
  //console.log("Pricing Client Results: \n" + JSON.stringify(pricingResponseArray, null, 2));

  // Array of interface Response
  /*
  Example instance of interface
  [{
    instanceType: 't3.micro',
    location: 'EU (London)',
    onDemandKey: '3GWWBY5KGSJCW4F7.JRTCKXETXF',
    priceDimensionKey: '3GWWBY5KGSJCW4F7.JRTCKXETXF.6YS6EN2CT7',
    pricePerUnit: '0.0886000000'
  },
  {
    instanceType: 't3.micro',
    location: 'EU (London)',
    onDemandKey: '289E23A945WMA3RZ.JRTCKXETXF',
    priceDimensionKey: '289E23A945WMA3RZ.JRTCKXETXF.6YS6EN2CT7',
    pricePerUnit: '0.0886000000'
  }]
  */
  let pricingResponses = lodashUnderscoreImplementation(pricingResponseArray)

  // final log out of pricingResponses array
  console.log("Responses:", pricingResponses);
};

// Dummy event
const event: Event = {
  region: "eu-west-2",
  instanceType: "t3.micro",
};

// Explicit call of handler. Uncomment when developing locally
// and run `ts-node src/lambdas/serverless-pricing/handler.ts` to test code in handler
exports.handler(event)
