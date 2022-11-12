variable "name" {
  description = "Name of the api-gateway to create"
  type        = string
}

variable "resource_name" {
  description = "Name of the API resource, also defined as the path part"
  type = string
  default = "ec2-pricing"
}

#API Gateway GET Resource
resource "aws_api_gateway_method" "get_method" {
  resource_id   = aws_api_gateway_resource.api_gateway_resource.id
  rest_api_id   = aws_api_gateway_rest_api.api_gateway.id
  authorization = "NONE"
  http_method   = "GET"
  request_parameters = {
    "method.request.querystring.instanceType" = true
    "method.request.querystring.region"       = true
  }
}