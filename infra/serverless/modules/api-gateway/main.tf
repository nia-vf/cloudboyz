#API Gateway REST API
resource "aws_api_gateway_rest_api" "api_gateway" {
  name = var.name
}

#API Fateawy Resource
resource "aws_api_gateway_resource" "api_gateway_resource" {
  parent_id   = aws_api_gateway_rest_api.api_gateway.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
  path_part   = var.resource_name
}



