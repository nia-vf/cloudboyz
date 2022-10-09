import { writeProductsToFile } from "./WriteProductsToFile"
import { productsArrayMock } from "./WriteProductsToFile.mocks";
import  * as fs from "fs";

test('function `writeProductsToFile` writes stringified Product object array to .json file', () => {
  const testOutputDir = "output_test"
  const fileName = "test_file.json"
  const fullPath = `./${testOutputDir}/${fileName}`
  writeProductsToFile(productsArrayMock,testOutputDir,fileName)
  expect(fs.existsSync(fullPath)).toBe(true);
  fs.rmdirSync(testOutputDir, { recursive: true })
});
