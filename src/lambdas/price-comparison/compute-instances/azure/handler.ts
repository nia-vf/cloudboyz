import { Context } from "aws-lambda";
import { 
  ResourceSkus,
  ResourceSku,
  ComputeManagementClient
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

//Price API response
interface Pricing {
  BillingCurrency: string;
  CustomerEntityId: string;
  CustomerEntityType: string;
  Items: PriceItem [];
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


dotenv.config({ path: __dirname + "/./../../../../../.env" });

let credentials: ClientSecretCredential | DefaultAzureCredential;

const tenantId: string = process.env["AZURE_TENANT_ID"] || "";
const clientId: string = process.env["AZURE_CLIENT_ID"] || "";
const clientSecret: string = process.env["AZURE_CLIENT_SECRET"] || "";
const subscriptionId: string = process.env["AZURE_SUBSCRIPTION_ID"] || "";
console.log(subscriptionId)

if (tenantId && clientId && clientSecret) {
  //console.log("development");
  credentials = new ClientSecretCredential(tenantId, clientId, clientSecret);
} else {
  credentials = new DefaultAzureCredential();
}

const filterName: string = "uksouth"
const vcpus: string = "6"
const memory: string = "12"
const instanceType: string = "Standard_NV8as_v4"



async function listResourceSkus() {
  try {
      //Use credential to authneticate with Azure SDKs
      const client = new ComputeManagementClient(credentials, subscriptionId)

      //list Resource Skus for subscription
      var valueResponse: ResourceSku[] = []
      for await (const item of client.resourceSkus.list({
        filter: "location eq '" + filterName + "'"
      })) {
        let resourceSku: ResourceSku = item
        valueResponse.push(resourceSku)
      }

      var filteredResponse = _.filter(valueResponse, function(sku){
        return sku.resourceType == "virtualMachines" && sku.name == "Standard_NV8as_v4"
      })

      return filteredResponse;
  } catch (err) {
      console.error(JSON.stringify(err))
  }
}

function getPrices(): Promise<PriceItem> {
  //Create Query Parameters
  var location: string = "UK South"
  var serviceName: string = "Virtual Machines"
  var serviceFamily: string = "Compute"
  var armSkuName: string = "Standard_NV8as_v4"

  return fetch("https://prices.azure.com/api/retail/prices?api-version=2021-10-01-preview&$filter=serviceName eq 'Virtual Machines' and serviceFamily eq 'Compute' and location eq 'UK South' and armSkuName eq 'Standard_NV8as_v4'")
  .then(res => res.json())
  .then(res => {
    return res as PriceItem
  })
}

var filteredSkuResponse = listResourceSkus()
console.log(filteredSkuResponse)

filteredSkuResponse.then( function(result){
  console.log(result)
})

var skuPriceResponse = getPrices()
skuPriceResponse.then( function(result){
  console.log(result)
})




// if( 
//   _.isEqual(item.locations, [ "uksouth" ])

// ){
//   _.find(item.capabilities, function(cap){ cap.name == "vCPUs"})

//   capability.value == vcpus
// }















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



//   //For testing
//   var testEvent: Event = {
//     region: "uksouth",
//     vcpus: "6",
//     memory: "12"
//   }

 

//   //Get list of Azure Resource Skus
//   exports.handler = async function (testEvent, context: Context){
//     var filtersMap = new Map<string, string>();
//     filtersMap.set("location", testEvent.region);


//   }
