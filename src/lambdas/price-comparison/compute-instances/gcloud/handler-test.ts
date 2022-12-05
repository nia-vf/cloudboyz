import { CloudCatalogClient } from "@google-cloud/billing";
import { google } from "@google-cloud/billing/build/protos/protos";
import _ from "lodash";

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
  instanceFamily?: string;
  operatingSystem?: string;
  regionCode?: string;
  location?: string;
  costs?: Cost[];
}

let catalogClient = new CloudCatalogClient();

//var request: google.cloud.billing.v1.IListSkusRequest | undefined =

//let request1 = new google.cloud.billing.v1.ListSkusRequest();

const request: google.cloud.billing.v1.IListSkusRequest = {
  parent: "services/6F81-5844-456A",
  pageSize: 5000,
};

async function callListSkus(request: google.cloud.billing.v1.IListSkusRequest) {
  let iterable = await catalogClient.listSkusAsync(request, {
    autoPaginate: false,
  });
  let i = 0;

  var skusList = [];

  for await (const response of iterable) {
    console.log(response);
    console.log(i);
    i++;

    skusList.push(response);
  }

  return skusList;
}

function truncateSkusList(skusList: google.cloud.billing.v1.ISku[]) {
  var filteredSkus = _.filter(skusList, function (sku) {
    return (
      sku.category?.resourceFamily == "Compute" &&
      sku.category?.usageType == "OnDemand" &&
      _.includes(sku.serviceRegions, "europe-west2")
    );
  });

  console.log(_.size(filteredSkus));
}

async function handlerExample() {
  var skusList = await callListSkus(request);
  truncateSkusList(skusList);
}

handlerExample();
