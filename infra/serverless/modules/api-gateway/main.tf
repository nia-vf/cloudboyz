#API Gateway
resource "aws_api_gateway_rest_api" "pricing_agw" {
  name = "serverless-pricing-api-gateway"
}