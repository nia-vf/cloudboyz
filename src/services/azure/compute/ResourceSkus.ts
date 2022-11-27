import { ClientSecretCredential, DefaultAzureCredential } from "@azure/identity";
import * as dotenv from "dotenv";
import { ResourceSkus } from "@azure/arm-compute";
//import { getProducts } from "./function/ListResourceSkus";

dotenv.config({ path: __dirname + "/./../../../../.env" } );

let credentials = null;

const tenantId = process.env["AZURE_TENANT_ID"]
console.log(tenantId)
//console.log(process.env.NODE_ENV)

// export class ResourceSkusAPI {


//   getProducts(filtersMap: Map<string, string>): Promise<ResourceSkus[]> {
//     return getProducts(filtersMap);
//   }
// }
