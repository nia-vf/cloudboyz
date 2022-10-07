import { Product } from "../../../../interfaces/product";

const fs = require("fs");

export const writeProductsToFile = (filtersMap: Map<string, string>, products: Product[]) => {
    let filterString = "";
    filtersMap.forEach((value,key) => {
      filterString = filterString.concat(`-${value}`)
    })
    fs.appendFile(
      `output/${Date.now()}${filterString}
        .toString()}.json`,
        JSON.stringify(products, null, 2),
      (err: Error) => {
        // In case of a error throw err.
        if (err) throw err;
      }
    );
  }