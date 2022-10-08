import { getProducts, writeProductsToFile } from "./services/aws/pricing";

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
  const products = await getProducts(filtersMap);
  writeProductsToFile(filtersMap,products)
})();
