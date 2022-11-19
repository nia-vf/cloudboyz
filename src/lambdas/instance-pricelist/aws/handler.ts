import { Context } from "aws-lambda";
import { Product } from "../../../interfaces/product";
import { PricingAPI } from "../../../services/aws/pricing";
import _ from "lodash";

//Lambda request parameters
interface Event {
  instanceType: string;
  region: string;
}

//Lambda response body
interface Cost {
  purchaseType?: string;
  purchaseOption?: string;
  costPerUnit?: number;
  termLength?: string;
  offeringClass?: string;
}

interface Response {
  instanceType?: string;
  memory?: string;
  storage?: string;
  vcpus?: string;
  networkPerformance?: string;
  instanceFamily?: string;
  operatingSystem?: string;
  regionCode?: string;
  location?: string;
  costs?: Cost[];
  normalizationSizeFactor?: string;
}

const truncateAwsInstancePricingData = (
  pricingResponseArray: Product[]
): Response[] => {
  let pricingResponses: Response[] = [];

  //Filter Data
  var filteredPricingData = _.filter(pricingResponseArray, function (prod) {
    return (
      prod.product?.attributes?.tenancy == "Shared" &&
      prod.product?.attributes?.capacitystatus == "Used" &&
      prod.product?.attributes?.preInstalledSw == "NA"
    );
  });

  //Cycle through data to get prices
  _.each(filteredPricingData, function (prod) {
    var costs: Cost[] = [];

    //On Demand cost
    for (const [onDemandKey, onDemandValue] of _.entries(
      prod.terms?.OnDemand
    )) {
      var price = 0;
      for (const [priceDimensionKey, priceDimensionValue] of _.entries(
        onDemandValue.priceDimensions
      )) {
        //
        price += Number(priceDimensionValue.pricePerUnit?.USD);
      }
      costs.push({
        purchaseType: "On Demand",
        purchaseOption: "N/A",
        costPerUnit: price,
        termLength: "N/A",
        offeringClass: "N/A",
      });
    }

    //Reserved costs (Standard and Convertible)
    for (const [reservedKey, reservedValue] of _.entries(
      prod.terms?.Reserved
    )) {
      var price = 0;
      for (const [priceDimensionKey, priceDimensionValue] of _.entries(
        reservedValue.priceDimensions
      )) {
        if (
          priceDimensionValue.unit == "Quantity" ||
          priceDimensionValue.description == "Upfront Fee"
        ) {
          if (reservedValue.termAttributes?.LeaseContractLength == "1yr") {
            price += Number(priceDimensionValue.pricePerUnit?.USD) / (12 * 730);
          } else {
            price += Number(priceDimensionValue.pricePerUnit?.USD) / (36 * 730);
          }
        } else {
          price += Number(priceDimensionValue.pricePerUnit?.USD);
        }
      }
      costs.push({
        purchaseType: "Reserved",
        purchaseOption: reservedValue.termAttributes?.PurchaseOption,
        costPerUnit: price,
        termLength: reservedValue.termAttributes?.LeaseContractLength,
        offeringClass: reservedValue.termAttributes?.OfferingClass,
      });
    }

    pricingResponses.push({
      instanceType: prod.product?.attributes?.instanceType,
      memory: prod.product?.attributes?.memory,
      vcpus: prod.product?.attributes?.vcpu,
      storage: prod.product?.attributes?.storage,
      networkPerformance: prod.product?.attributes?.networkPerformance,
      instanceFamily: prod.product?.attributes?.instanceFamily,
      operatingSystem: prod.product?.attributes?.operatingSystem,
      regionCode: prod.product?.attributes?.regionCode,
      location: prod.product?.attributes?.location,
      costs: costs,
      normalizationSizeFactor:
        prod.product?.attributes?.normalizationSizeFactor,
    });
  });
  return pricingResponses;
};

//Get EC2 instance products
exports.handler = async function (event: Event, context: Context) {
  var filtersMap = new Map<string, string>();
  filtersMap.set("regionCode", event.region);

  const pricingApi = new PricingAPI({ region: "us-east-1", maxAttempts: 2 });
  const pricingResponseArray = await pricingApi.getProducts(filtersMap);

  let pricingResponses = truncateAwsInstancePricingData(pricingResponseArray);

  console.log("Response:", pricingResponses);

  const response = {
    body: pricingResponses,
  };
  return response;
};
