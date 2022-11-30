import { Context } from "aws-lambda";
import {
  ResourceSkus,
  ResourceSku,
  ComputeManagementClient,
} from "@azure/arm-compute";
import {
  ClientSecretCredential,
  DefaultAzureCredential,
} from "@azure/identity";
import dotenv from "dotenv";
import _ from "lodash";
import fetch from "node-fetch";

//Lambda request parameters
interface Event {
  region: string;
  vcpus: string;
  memory: string;
  instanceFamily?: string;
  tenancy?: string;
  capacityStatus?: string;
  preInstalledSoftware?: string;
}

//Lambda response body
//Add interface for Lambda response

//Price API response
interface Pricing {
  BillingCurrency: string;
  CustomerEntityId: string;
  CustomerEntityType: string;
  Items: PriceItem[];
  NextPageLink?: string;
  Count: number;
}

interface PriceItem {
  currencyCode?: string;
  tierMinimumUnits?: number;
  retailPrice?: number;
  unitPrice?: number;
  armRegionName?: string;
  location?: string;
  effectiveStartDate?: string;
  meterId?: string;
  meterName?: string;
  productId?: string;
  skuId?: string;
  availabilityId?: string;
  productName?: string;
  skuName?: string;
  serviceName?: string;
  serviceId?: string;
  serviceFamily?: string;
  unitOfMeasure?: string;
  type?: string;
  isPrimaryMeterRegion?: boolean;
  armSkuName?: string;
}

//Dummy Event
let dummyEvent: Event = {
  region: "uksouth",
  vcpus: "4",
  memory: "16",
};

//Get Credentials
dotenv.config({ path: __dirname + "/./../../../../../.env" });

let credentials: ClientSecretCredential | DefaultAzureCredential;

const tenantId: string = process.env["AZURE_TENANT_ID"] || "";
const clientId: string = process.env["AZURE_CLIENT_ID"] || "";
const clientSecret: string = process.env["AZURE_CLIENT_SECRET"] || "";
const subscriptionId: string = process.env["AZURE_SUBSCRIPTION_ID"] || "";
console.log(subscriptionId);

if (tenantId && clientId && clientSecret) {
  credentials = new ClientSecretCredential(tenantId, clientId, clientSecret);
} else {
  credentials = new DefaultAzureCredential();
}

async function listResourceSkus(event: Event) {
  try {
    //Use credential to authneticate with Azure SDKs
    const client = new ComputeManagementClient(credentials, subscriptionId);

    //list Resource Skus for subscription
    var valueResponse: ResourceSku[] = [];
    for await (const item of client.resourceSkus.list({
      filter: "location eq '" + event.region + "'",
    })) {
      let resourceSku: ResourceSku = item;
      valueResponse.push(resourceSku);
    }

    var filteredResponse = _.filter(valueResponse, function (sku) {
      let memoryGb: any = _.find(sku.capabilities, function (cap) {
        return cap.name == "MemoryGB";
      });
      let vcpuCount: any = _.find(sku.capabilities, function (cap) {
        return cap.name == "vCPUs";
      });
      return (
        sku.resourceType == "virtualMachines" &&
        memoryGb.value == event.memory &&
        vcpuCount.value == event.vcpus
      );
      //&& sku.name == "Standard_NV8as_v4"
    });
    console.log(_.size(filteredResponse));

    return filteredResponse;
  } catch (err) {
    console.error(JSON.stringify(err));
  }
}

async function getPrices(skuData: ResourceSku[] | undefined): Promise<Pricing> {
  //loop and make call for each skuName
  let armSkuNameFilter: string = "";
  //loop over and push to Pricing to build armSkuName filter
  if (skuData != undefined) {
    var i: number = 0;
    _.each(skuData, function (sku) {
      var armSkuName: string | undefined = sku.name;
      if (i == 0 && armSkuName) {
        armSkuNameFilter += "armSkuName eq '" + armSkuName + "'";
      } else if (i > 0 && i < 15 && armSkuName) {
        //need to limit to 15 SKUs otherwise API returns error most likely due to filter length
        armSkuNameFilter += " or armSkuName eq '" + armSkuName + "'";
      }
      i++;
    });
  }
  if (armSkuNameFilter.length > 0) {
    armSkuNameFilter = " and (" + armSkuNameFilter + ")";
  }

  //Query parameters for Price API call
  let apiVersion: string = "api-version=2021-10-01-preview";
  let filters: string =
    "$filter=serviceName eq 'Virtual Machines' and serviceFamily eq 'Compute' and location eq 'UK South' and priceType eq 'Consumption'" +
    armSkuNameFilter;
  let queryParameters: string = "?" + apiVersion + "&" + filters;
  console.log("Query Parameters: ", queryParameters);

  //Call API and get response (as a 'Pricing' object)
  let priceApiUrl: string =
    "https://prices.azure.com/api/retail/prices" + queryParameters;
  console.log(priceApiUrl.length);
  var skuPrice = await fetch(
    "https://prices.azure.com/api/retail/prices" + queryParameters
  )
    .then((res) => res.json())
    .then((res) => {
      return res as Pricing;
    });

  return skuPrice;
}

async function example() {
  var filteredSkuResponse = await listResourceSkus(dummyEvent);
  //console.log( "Non-Promise: ", filteredSkuResponse)

  var skuPriceResponse = await getPrices(filteredSkuResponse);
  console.log(skuPriceResponse);
}

example();

// //Lambda response body
// interface Cost {
//     purchaseType?: string;
//     purchaseOption?: string;
//     costPerUnit?: number;
//     termLength?: string;
//     offeringClass?: string;
//   }

//   interface Response {
//     instanceType?: string;
//     memory?: string;
//     storage?: string;
//     vcpus?: string;
//     networkPerformance?: string;
//     instanceFamily?: string;
//     operatingSystem?: string;
//     regionCode?: string;
//     location?: string;
//     costs?: Cost[];
//     normalizationSizeFactor?: string;
//   }
