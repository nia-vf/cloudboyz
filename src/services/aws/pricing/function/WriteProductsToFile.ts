import { Product } from "../../../../interfaces/product";
const fs = require('fs');

export const writeProductsToFile = (
  filtersMap: Map<string, string>,
  products: Product[]
) => {
  let filterString = "";
  filtersMap.forEach((value, key) => {
    filterString = filterString.concat(`-${value}`);
  });

  const filename = `output/${Date.now()}${filterString}.json`

  const outputDir = "./output";
  // check if directory exists and create if not.
  if (fs.existsSync(outputDir)) {
    console.log("Output directory exists!");
  } else {
    console.log("Ouput directory not found.\nCreating ...");
    fs.mkdirSync(outputDir)
    console.log("Ouput directory created!");
  }

  console.log(`Creating output file ${filename}`);
  fs.appendFile(
    filename,
    JSON.stringify(products, null, 2),
    (e: Error) => {
      // In case of a error throw err.
      if (e) throw e;
    }
  );
  console.log(`${filename} created successfully!`);
};
