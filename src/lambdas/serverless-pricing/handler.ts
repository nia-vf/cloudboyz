import { Context } from "aws-lambda";
import { PricingAPI } from "../../services/aws/pricing";

interface Query {
  queries: Map<string, string>;
}

exports.handler = async function (event: Query, context: Context) {
  const filtersMap = new Map<string, string>(event.queries);
  const pricingApi = new PricingAPI({ region: "us-east-1", maxAttempts: 2 });
  const pricing = await pricingApi.getProducts(filtersMap);
  console.log("Pricing Client Results: \n" + JSON.stringify(pricing, null, 2));
};
