import { Product } from "../../../../interfaces/product";
import * as fs from "fs";

const getOutputDir = (dir?: string) => (dir ? "./" + dir : "./output");

const getFileName = (outputDir: string, filename?: string) =>
  outputDir + "/" + (filename ? filename : `${Date.now()}.json`);

export const writeProductsToFile = (
  products: Product[],
  outputDirectory?: string,
  fileName?: string
) => {
  const outputDir = getOutputDir(outputDirectory);
  const filename = getFileName(outputDir, fileName);

  // check if directory exists and create if not.
  if (fs.existsSync(outputDir)) {
    console.log("Output directory exists!");
  } else {
    console.log("Ouput directory not found.\nCreating ...");
    fs.mkdirSync(outputDir);
    console.log("Ouput directory created!");
  }

  console.log(`Creating output file ${filename}`);
  fs.writeFile(filename, JSON.stringify(products, null, 2), (e) => {
    // In case of a error throw err.
    if (e) throw e;
  });
  console.log(`${filename} created successfully!`);
};

