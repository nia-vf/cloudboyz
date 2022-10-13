import {
  writeProductsToFile,
  PricingAPI,
  getProducts,
} from "./services/aws/pricing";

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (question: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    rl.question(question, (answer: string) => {
      resolve(answer);
    });
  });
};

(async () => {
  const instanceType = await question(
    "What Instance Type? (default. t3.micro): "
  );
  const operatingSystem = await question(
    "What Operating System? (default. Linux): "
  );
  const filtersMap = new Map<string, string>([
    ["instanceType", instanceType != "" ? instanceType : "t3.micro"],
    ["operatingSystem", operatingSystem != "" ? operatingSystem : "Linux"],
  ]);

  // class instance of PricingAPI now available with configurable defaults
  const pricingApi = new PricingAPI({ region: "us-east-1", maxAttempts: 2 });

  // can call custom functions which use the pricingAPI directly
  const products = await pricingApi.getProducts(filtersMap);

  // can call pricingApi class functions directly and it use the default client
  // const productsUsingFunctionAndDefaultClient = await getProducts(filtersMap);

  // some functions are seperate from the api client but part of the pricing service
  // and so are called directly from the service/aws/pricing library
  writeProductsToFile(products);
})();
