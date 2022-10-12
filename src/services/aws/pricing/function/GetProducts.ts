import {
  Filter,
  GetProductsCommand,
  GetProductsCommandOutput,
  GetProductsRequest,
  PricingClient,
  paginateGetProducts,
  PricingPaginationConfiguration,
  Pricing,
} from "@aws-sdk/client-pricing";
import { client } from "..";
import { Product } from "../../../../interfaces/product";

const createFilters = (filtersMap: Map<string, string>) => {
  let filters: Filter[] = [];
  filtersMap.forEach((value, key) => {
    const filter: Filter = {
      Field: key,
      Value: value,
      Type: "TERM_MATCH",
    };
    filters = [...filters, filter];
  });
  return filters;
};

export const getProducts = async (
  filtersMap: Map<string, string>,
  priceClient: PricingClient = client
): Promise<Product[]> => {
  let config: PricingPaginationConfiguration = {
    client: priceClient,
  };
  const filters = createFilters(filtersMap);
  let params: GetProductsRequest = {
    ServiceCode: "AmazonEC2",
    Filters: filters,
  };
  let command = new GetProductsCommand(params);
  const pages = paginateGetProducts(config, params);
  let total = 0;
  let products: Product[] = [];
  for await (const page of pages) {
    total += page.PriceList?.length as number;
    page.PriceList?.forEach((product) => {
      const productStruct: Product = JSON.parse(product.toString());
      products = [productStruct, ...products];
      //console.log(`${JSON.stringify(productStruct.product, null, 2)}`);
    });
  }
  console.log(
    `Total products found for ${Array.from(filtersMap)
      .flatMap((v, k) => `${v[0]}:${v[1]}`)
      .toString()
      .replace(",", " ")} => ${total}`
  );
  console.log("Complete!");
  return products;
};
