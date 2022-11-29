import {
  ResourceSkus,
  ComputeManagementClient,
  ResourceSkusListOptionalParams,
} from "@azure/arm-compute";
import { getMaxListeners } from "process";
import { client } from "../../../aws/pricing";
//import {client } from "..";

// let skuCapabilities: ResourceSkuCapabilities = {
//     name: "dfdffd",
//     value: "sdnjfks"
// }

// let sku: ResourceSku = {
//     capabilities: [
//         skuCapabilities
//     ],
//     capacity: {
//         default:
//     }
// }

const createFilters = (filtersMap: Map<string, string>) => {
  let filterString: string = "";

  filtersMap.forEach((value, key) => {
    if (key == filtersMap[0]) {
      let filterMember = key + " eq '" + value + "'";
      filterString += filterMember;
    } else {
      let filterMember = " and " + key + " eq '" + value + "'";
      filterString += filterMember;
    }
  });

  let optionalParams: ResourceSkusListOptionalParams = {
    filter: filterString,
  };

  interface Filter {}

  let filters: Filter[] = [];
  filtersMap.forEach((value, key) => {
    const filter: Filter = key + " eq '" + value + "'";
    filters = [...filters, filter];
  });
  return filters;
};

export const getProducts = async (
  filtersMap: Map<string, string>,
  computeClient: ComputeManagementClient
): Promise<ResourceSkus[]> => {
  const filters = createFilrwea;

  return getMaxListeners, client;
};
//some stuff
