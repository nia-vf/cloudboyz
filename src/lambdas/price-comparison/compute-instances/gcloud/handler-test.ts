import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { CloudCatalogClient } from "@google-cloud/billing";
import { google as GoogleBilling } from "@google-cloud/billing/build/protos/protos";
import { google as GoogleCompute } from "@google-cloud/compute/build/protos/protos";
import { MachineTypesClient } from "@google-cloud/compute";
import _ from "lodash";
import * as apiResponse from "../../../../data/gcloud/gcloud-compute-instances-pricing.json";
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
  instanceType?: string | null;
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

//Get Credentials
async function getCredentials(){
  const secret_name = "prod/pricing-comparison/instance/gcloud-creds"

  const secretsManagerClient = new SecretsManagerClient({
    region: "eu-west-2"
  })

  let secretsResponse: any;

  let machineTypesClient = new MachineTypesClient()

  try {
    secretsResponse = await secretsManagerClient.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    );

    const secret = JSON.parse(secretsResponse.SecretString);
    console.log("Secret: ", secret)

    machineTypesClient = new MachineTypesClient({
      keyFilename: secret.private_key
    });

  } catch (error) {
    try {
      machineTypesClient = new MachineTypesClient({
        keyFilename: "../../../../../service-account-key.json"
      });

    } catch (error) {
      throw error;
    }
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    //throw error;
  }
}

//Get list of Machine Types
async function callListMachineTypes(event: Event) {
  //Create Client for Machine Types API
  let machineTypesClient = new MachineTypesClient(
  );

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
  var priceData: Response[] = [];
  _.each(machineTypes, function (machine) {
    var machineTypeName = machine.name?.split("-")[0].toUpperCase();

    //Filter Skus for only specified Machine Type
    var matchingSku = _.filter(skusList, function (sku) {
      let skuName = sku.description?.split(" ")[0].toUpperCase();
      return (
        skuName == machineTypeName && !_.includes(sku.description, "Custom")
      );
    });
    //console.log(matchingSku)

    //Get Price for Machine Type (only if SKU exists for Region)
    if (_.size(matchingSku) > 1) {
      var totalPrice = 0;
      _.each(matchingSku, function (sku) {
        let unitAmount = 0; //unit amount is how many vcpus/ram in gb
        if (sku.category?.resourceGroup == "CPU") {
          unitAmount = Number(event.vcpus);
        } else if (sku.category?.resourceGroup == "RAM") {
          unitAmount = Number(event.memory);
        }

        _.each(sku.pricingInfo, function (info) {
          //Check data for calculations exist
          let displayQuantity = 1;
          if (info.pricingExpression?.displayQuantity) {
            displayQuantity = info.pricingExpression?.displayQuantity;
          }
          let unitPrice = 0,
            unitPriceNano = 0;
          if (info.pricingExpression?.tieredRates) {
            unitPrice = Number(
              info.pricingExpression?.tieredRates[0].unitPrice?.units
            );
            unitPriceNano = Number(
              info.pricingExpression?.tieredRates[0].unitPrice?.nanos
            );
          }

          var componentPrice =
            displayQuantity *
            unitAmount *
            (unitPrice + unitPriceNano / 1000000000);
          console.log(
            machineTypeName + " " + sku.category?.resourceGroup + " Price: ",
            componentPrice
          );
          totalPrice += componentPrice;
        });
      });

      console.log(machineTypeName + " Price: ", totalPrice);

      priceData.push({
        instanceType: machine.name,
        memory: event.memory,
        vcpus: event.vcpus,
        operatingSystem: "Linux",
        regionCode: event.region,
        location: "London, United Kingdom",
        costs: [
          {
            purchaseType: "On Demand",
            purchaseOption: "N/A",
            costPerUnit: totalPrice,
            termLength: "N/A",
            offeringClass: "N/A",
          },
        ],
      });
    }
  });
  console.log(priceData);

  return priceData;
}

async function handlerExample() {
  var secretResponse = await getCredentials()
  // var machineTypeResponse = await callListMachineTypes(dummyEvent);
  // console.log(machineTypeResponse);
  // var skusList = await callListSkus(dummyEvent);
  // //console.log(skusList)
  // console.log(_.size(skusList));
  // truncateSkusList(dummyEvent, machineTypeResponse, skusList);
}

handlerExample();
