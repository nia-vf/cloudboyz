import { Context } from "aws-lambda";
import { PricingAPI } from "../../services/aws/pricing";
import _ from "underscore";

interface Query {
  queries: Map<string, string>;
}

exports.handler = async function (event: Query, context: Context) {
  console.log("Event", event)

  var filtersMap = new Map<string, string>();
  filtersMap.set( "regionCode", event.region )
  filtersMap.set( "instanceType", event.instanceType )


  const pricingApi = new PricingAPI({ region: "us-east-1", maxAttempts: 2 });
  const pricing = await pricingApi.getProducts(filtersMap);
  console.log("Pricing Client Results: \n" + JSON.stringify(pricing, null, 2));

  var pricingResponse: Object = {

  }
  _.each(pricing, function(product){
    pricingResponse["instanceType"] = product.attributes.instanceType
    pricingResponse["location"] = product.attributes.location
    var onDemandCodes = _.keys(product.terms.OnDemand)
    _.each(product.terms.OnDemand[onDemandCodes], function(od){
      var priceDimensionCodes = _.keys(od.priceDimensions)
      _.each(od.priceDimensions[priceDimensionCodes], function(pd){
        pricingResponse["pricePerUnit"] = pd.pricePerUnit.USD
      })
    })
  })

  const response = {
    body: pricingResponse
  }

};
