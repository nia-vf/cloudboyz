import { Context } from "aws-lambda";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { ResourceSku, ComputeManagementClient } from "@azure/arm-compute";
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

async function getCredentials() {
  const secret_name = "prod/pricing-comparison/instance/azure-creds";

  const secretsManagerClient = new SecretsManagerClient({
    region: "eu-west-2",
  });

  let secretsResponse: any;

  try {
    secretsResponse = await secretsManagerClient.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    );
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    throw error;
  }

  const secret = JSON.parse(secretsResponse.SecretString);

  return secret;
}

async function listResourceSkus(
  event: Event,
  credentials: ClientSecretCredential | DefaultAzureCredential,
  subscriptionId: string
) {
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

function truncateAzureInstancePricingData(
  skuData: ResourceSku[] | undefined,
  priceData: Pricing,
  event: Event
): Response[] {
  //Filter Price Data from Pricing API response
  var filteredPriceData = _.reject(priceData.Items, function (item) {
    return (
      _.endsWith(item.skuName, "Low Priority") ||
      _.endsWith(item.skuName, "Spot") ||
      _.endsWith(item.productName, "Windows")
    );
  });

  //Build Response object from Pricing Data
  var response: Response[] = [];
  _.each(skuData, function (sku) {
    let skuPrice = _.find(filteredPriceData, function (price) {
      return price.armSkuName == sku.name;
    });

    if (skuPrice) {
      response.push({
        instanceType: skuPrice.meterName,
        memory: event.memory,
        vcpus: event.vcpus,
        operatingSystem: "Linux",
        regionCode: event.region,
        location: "London, United Kingdom",
        costs: [
          {
            purchaseType: "On Demand",
            purchaseOption: "N/A",
            costPerUnit: skuPrice.unitPrice,
            termLength: "N/A",
            offeringClass: "N/A",
          },
        ],
      });
    }
  });
  return response;
}

//Get Azure Compute instance prices
exports.handler = async function (event: Event, context: Context) {
  ////Get Credentials
  let credentials: ClientSecretCredential | DefaultAzureCredential;

  //Check locally for Credentials in first instance
  dotenv.config({ path: __dirname + "/./../../../../../.env" });
  var tenantId: string | undefined = process.env["AZURE_TENANT_ID"];
  var clientId: string | undefined = process.env["AZURE_CLIENT_ID"];
  var clientSecret: string | undefined = process.env["AZURE_CLIENT_SECRET"];
  var subscriptionId: string = process.env["AZURE_SUBSCRIPTION_ID"] || "";
  console.log(subscriptionId);

  //If Credentials exist locally create Azure Cred; else get Credentials from AWS Secrets Manager
  if (tenantId && clientId && clientSecret) {
    credentials = new ClientSecretCredential(tenantId, clientId, clientSecret);
  } else {
    var secretResponse = await getCredentials();
    console.log("Secrets:", secretResponse);
    console.log("Secrets object type:", typeof secretResponse);

    var secTenantId: string = secretResponse.AZURE_TENANT_ID;
    var secClientId: string = secretResponse.AZURE_CLIENT_ID;
    var secClientSecret: string = secretResponse.AZURE_CLIENT_SECRET;
    subscriptionId = secretResponse.AZURE_SUBSCRIPTION_ID;

    credentials = new ClientSecretCredential(
      secTenantId,
      secClientId,
      secClientSecret
    );
  }

  //Get Sku Data
  var filteredSkuResponse = await listResourceSkus(
    event,
    credentials,
    subscriptionId
  );

  //Get Price Data for Skus
  var skuPriceResponse = await getPrices(filteredSkuResponse);

  //Truncate Price Data into Response
  var response = truncateAzureInstancePricingData(
    filteredSkuResponse,
    skuPriceResponse,
    event
  );
  console.log("Response:", response);
};
