import { ResourceSkus } from "@azure/arm-compute";
import { getProducts } from "./function/ListResourceSkus";

export class ResourceSkusAPI {
  getProducts(filtersMap: Map<string, string>): Promise<ResourceSkus[]> {
    return getProducts(filtersMap);
  }
}
