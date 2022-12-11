import { CloudCatalogClient } from "@google-cloud/billing";
import { google as GoogleBilling } from "@google-cloud/billing/build/protos/protos";
import { google as GoogleCompute } from "@google-cloud/compute/build/protos/protos";
import { MachineTypesClient } from "@google-cloud/compute";
import _ from "lodash";
import * as apiResponse from "../../../../../data/gcloud/gcloud-compute-instances-pricing.json";
import { machine } from "os";

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

//Dummy Event
let dummyEvent: Event = {
  region: "europe-west2",
  vcpus: "4",
  memory: "16",
};

//Get list of Machine Types
async function callListMachineTypes(event: Event) {
  //Create Client for Machine Types API
  let machineTypesClient = new MachineTypesClient();

  //Create Request Parameters
  const machineTypeRequest: GoogleCompute.cloud.compute.v1.IListMachineTypesRequest =
    {
      project: "kubernetes-project-313908",
      zone: "us-central1-a",
      filter:
        'description = "' +
        event.vcpus +
        " vCPUs, " +
        event.memory +
        ' GB RAM"',
    };

  var machineTypeList: GoogleCompute.cloud.compute.v1.IMachineType[] = [];

  let machineTypeObject = await machineTypesClient.listAsync(
    machineTypeRequest
  );
  let i = 0;
  for await (const response of machineTypeObject) {
    //console.log(response);
    console.log(i);
    i++;
    machineTypeList.push(response);
  }
  return machineTypeList;
}

//Get List of Sku Prices
async function callListSkus(event: Event) {
  //Create Client for Pricing API
  let catalogClient = new CloudCatalogClient();

  //Create Request Parameters
  const skuPriceRequest: GoogleBilling.cloud.billing.v1.IListSkusRequest = {
    parent: "services/6F81-5844-456A",
    pageSize: 5000,
  };

  var skusList: any = [];

  if (apiResponse) {
    skusList = apiResponse;
  } else {
    let iterable = await catalogClient.listSkusAsync(skuPriceRequest, {
      autoPaginate: false,
    });

    let i = 0;
    for await (const response of iterable) {
      console.log(response);
      console.log(i);
      i++;

      skusList.push(response);
    }
  }

  //Filter Skus for only requested region
  var filteredSkus = _.filter(skusList, function (sku) {
    return (
      sku.category?.resourceFamily == "Compute" &&
      //sku.category?.usageType == "OnDemand" &&
      _.includes(sku.serviceRegions, event.region)
    );
  });

  return filteredSkus;
}

//Truncate Sku Data
function truncateSkusList(
  event: Event,
  machineTypes: GoogleCompute.cloud.compute.v1.IMachineType[],
  skusList: GoogleBilling.cloud.billing.v1.ISku[]
) {
  var filteredSkus = _.filter(skusList, function (sku) {
    return (
      sku.category?.resourceFamily == "Compute" &&
      sku.category?.usageType == "OnDemand" &&
      sku.category?.resourceGroup == "N1Standard" &&
      _.includes(sku.serviceRegions, "europe-west2")
    );
  });

  console.log(filteredSkus);
  console.log(_.size(filteredSkus));
}

async function handlerExample() {
  var machineTypeResponse = await callListMachineTypes(dummyEvent);
  console.log(machineTypeResponse);
  //var skusList = await callListSkus(dummyEvent);
  //truncateSkusList(dummyEvent, machineTypeResponse, skusList);
}

handlerExample();
