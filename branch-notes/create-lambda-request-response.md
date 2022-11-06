[ Changelog ]

- Updated serverless-pricing-api lambda function to take the following query parameters as an input:
  - instanceType
  - region
- Updated serverless-pricing-api lambda function to return a json body with the following fields:
  - instanceType
  - location
  - sku
  - offerTermCode
  - priceRateCode
  - pricePerUnit
