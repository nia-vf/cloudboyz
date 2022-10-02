import {
  GetProductsCommand,
  GetProductsCommandOutput,
  GetProductsRequest,
  PricingClient,
} from "@aws-sdk/client-pricing";

const client = new PricingClient({ region: "us-east-1" });
const fs = require("fs");

const params: GetProductsRequest = {
  ServiceCode: "AmazonEC2",
};
const command = new GetProductsCommand(params);

const getPrices = async () => {
  console.log("Console logging DescribeServicesCommand client.send");
  try {
    const data: GetProductsCommandOutput = await client.send(command);
    if (data.PriceList) {
      data.PriceList.forEach((item) => {
        console.log(JSON.parse(item.toString()));
      });
      fs.writeFile("Output.txt", data.PriceList.toString(), (err: Error) => {
        // In case of a error throw err.
        if (err) throw err;
      });
    }
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await getPrices();
})();
