import {
    Filter,
  GetProductsCommand,
  GetProductsCommandOutput,
  GetProductsRequest,
  PricingClient,
} from "@aws-sdk/client-pricing";
import { Product } from "./interfaces/product";

const client = new PricingClient({ region: "us-east-1" });
const fs = require("fs");

let params: GetProductsRequest = {
  ServiceCode: "AmazonEC2",
  Filters: [
  ],
};
const command = new GetProductsCommand(params);

const updateFilters = (instanceType: string, operatingSystem: string) => {
  let instanceTypeUpdate: Filter = { Field: "instanceType", Value: "", Type: "TERM_MATCH" }
  let operatingSystemUpdate: Filter = { Field: "operatingSystem", Value: "", Type: "TERM_MATCH" }

  instanceTypeUpdate.Value = (instanceType != "") ? instanceType : "t3.micro"
  operatingSystemUpdate.Value = (operatingSystem != "") ? operatingSystem : "Linux"
  
  params.Filters = [ instanceTypeUpdate, operatingSystemUpdate ]
};

const getPrices = async () => {
  console.log("Console logging DescribeServicesCommand client.send");
  try {
    let data: GetProductsCommandOutput = await client.send(command);
    let writeBuffer = "";
    console.log("**********************************");
    console.log("* Instance Type * Memory * VCPUs *");
    while (data.NextToken) {
      if (data.PriceList) {
        data.PriceList.forEach((product) => {
          const struct: Product = JSON.parse(product.toString());
          console.log(
            `${JSON.stringify(struct, null, 2)}`
          );
        });
        writeBuffer += data.PriceList.toString();
      }

      params.NextToken = data.NextToken;

      data = await client.send(command);
    }
    console.log("**********************************");
    fs.appendFile(
      `output-${params.Filters?.map((filter) => filter.Value?.toLowerCase())
        .join("-")
        .toString()}.json`,
      writeBuffer,
      (err: Error) => {
        // In case of a error throw err.
        if (err) throw err;
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (question: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      rl.question(question, (answer: string) => {
        resolve(answer)
      })
    })
  }

(async () => {
    const instanceType = await question('What Instance Type? (default. t3.micro): ');
    const operatingSystem  = await question('What Operating System? (default. Linux): ');
    updateFilters(instanceType, operatingSystem);
    await getPrices();
})();

