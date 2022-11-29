import {
  ClientSecretCredential,
  DefaultAzureCredential,
} from "@azure/identity";
import * as dotenv from "dotenv";
import { ResourceSkus, ComputeManagementClient } from "@azure/arm-compute";
import { Compute } from "aws-sdk/clients/workspaces";
import { getProducts } from "./function/ListResourceSkus";

dotenv.config({ path: __dirname + "/./../../../../.env" });

let credentials = null;

interface EnvironmentVariables {
  tenantId?: string;
  clientId?: string;
  clientSecret?: string;
  subscriptionId?: string;
}

let envVariables: EnvironmentVariables = {
  tenantId: process.env["AZURE_TENANT_ID"],
  clientId: process.env["AZURE_CLIENT_ID"],
  clientSecret: process.env["AZURE_CLIENT_SECRET"],
  subscriptionId: process.env["AZURE_SUBSCRIPTION_ID"],
};

if (
  envVariables.tenantId &&
  envVariables.clientId &&
  envVariables.clientSecret &&
  envVariables.subscriptionId
) {
  credentials = new ClientSecretCredential(
    envVariables.tenantId,
    envVariables.clientId,
    envVariables.clientSecret
  );

  const client = new ComputeManagementClient(
    credentials,
    envVariables.subscriptionId
  );

  async function listResourceSkus() {
    try {
      for await (const item of client.resourceSkus.list()) {
        const resourceSkuDetails = await client.resourceSkus.list();
      }
    } catch {}
  }

  // export class ResourceSkusAPI {

  //   getProducts(filtersMap: Map<string, string>): Promise<ResourceSkus[]> {
  //     return this.getProducts(filtersMap, client)
  //   }
  // }
}
