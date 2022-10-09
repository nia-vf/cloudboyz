import { PricingClient } from "@aws-sdk/client-pricing";
export { PricingAPI } from "./Pricing";
export { getProducts } from "./function/GetProducts";
export { writeProductsToFile } from "./function/WriteProductsToFile";

export const client = new PricingClient({ region: "us-east-1" });
