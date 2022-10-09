import {
  Filter,
  GetProductsCommand,
  GetProductsCommandOutput,
  GetProductsRequest,
} from "@aws-sdk/client-pricing";
import { client } from "..";
import { Product } from "../../../../interfaces/product";

const createFilters = (filtersMap: Map<string, string>) => {
  let filters: Filter[] = [];
  filtersMap.forEach((value,key) => {
    const filter: Filter = {
      Field: key,
      Value: value,
      Type: "TERM_MATCH",
    };
    filters = [...filters, filter];
  });
  return filters;
};

export const getProducts = async (filtersMap: Map<string, string> ): Promise<Product[]> => {
  const filters = createFilters(filtersMap);
  let params: GetProductsRequest = {
    ServiceCode: "AmazonEC2",
    Filters: filters,
  };
  let command = new GetProductsCommand(params);
  let products: Product[] = []
  try {
    let data: GetProductsCommandOutput = await client.send(command);
    do {
      if (data.PriceList) {
        data.PriceList.forEach((product) => {
          const productStruct: Product = JSON.parse(product.toString());
          products = [productStruct, ...products]
          console.log(`${JSON.stringify(productStruct.product, null, 2)}`);
        });
      }
      params.NextToken = data.NextToken;
      data = await client.send(command);
    } while (data.NextToken) 
    console.log("Complete!")
    return products;
  } catch (e) {
    throw e;
  }
};
