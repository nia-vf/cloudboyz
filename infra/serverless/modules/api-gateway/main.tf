#API Gateway
resource "aws_api_gateway_rest_api" "api_gateway" {
  name = var.name
}