import { PricingClient, PricingClientConfig } from "@aws-sdk/client-pricing";
import { Product } from "../../../interfaces/aws/product";
import { getProducts } from "./function/GetProducts";

export class PricingAPI {
  private client: PricingClient;

  getProducts(filtersMap: Map<string, string>): Promise<Product[]> {
    return getProducts(filtersMap, this.client);
  }

  constructor(configuration: PricingClientConfig) {
    // Defaults to us-east-1 regardless of user input as only valid endpoint
    this.client = new PricingClient({ ...configuration, region: "us-east-1" });
  }
}
