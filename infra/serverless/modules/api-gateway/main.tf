#API Gateway REST API
resource "aws_api_gateway_rest_api" "api_gateway" {
  name = var.name
}

#API Gateway Resource
resource "aws_api_gateway_resource" "api_gateway_resource" {
  parent_id   = aws_api_gateway_rest_api.api_gateway.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
  path_part   = var.resource_name
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

resource "aws_api_gateway_integration" "get_integration" {
  resource_id             = aws_api_gateway_resource.api_gateway_resource.id
  rest_api_id             = aws_api_gateway_rest_api.api_gateway.id
  http_method             = aws_api_gateway_method.get_method.http_method
  integration_http_method = "POST"
  type                    = "AWS"
  uri                     = module.lambda_function.lambda_function_invoke_arn

  request_templates = {
    "application/json" = <<MAPPING_TEMPLATE
    {
      "instanceType": "$input.params('instanceType')",
      "region": "$input.params('region')"
    }
    MAPPING_TEMPLATE
  }
  passthrough_behavior = "WHEN_NO_TEMPLATES"

  depends_on = [
    aws_api_gateway_method.get_method, module.lambda_function
  ]
}

resource "aws_api_gateway_method_response" "get_method_response_200" {
  resource_id = aws_api_gateway_resource.api_gateway_resource.id
  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
  http_method = aws_api_gateway_method.get_method.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
  }
  response_models = {
    "application/json" = "Empty"
  }

  depends_on = [
    aws_api_gateway_method.get_method
  ]
}

resource "aws_api_gateway_integration_response" "get_int_response_200" {
  resource_id = aws_api_gateway_resource.api_gateway_resource.id
  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
  http_method = aws_api_gateway_method.get_method.http_method
  status_code = aws_api_gateway_method_response.get_method_response_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

  depends_on = [
    aws_api_gateway_integration.get_integration
  ]
}

#API Gateway OPTIONS Resource
resource "aws_api_gateway_method" "opt_method" {
  resource_id   = aws_api_gateway_resource.api_gateway_resource.id
  rest_api_id   = aws_api_gateway_rest_api.api_gateway.id
  authorization = "NONE"
  http_method   = "OPTIONS"
}

resource "aws_api_gateway_integration" "opt_integration" {
  resource_id = aws_api_gateway_resource.api_gateway_resource.id
  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
  http_method = aws_api_gateway_method.opt_method.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = <<MAPPING_TEMPLATE
    {
      "statusCode": 200
    }
    MAPPING_TEMPLATE
  }
  passthrough_behavior = "WHEN_NO_MATCH"

  depends_on = [
    aws_api_gateway_method.opt_method
  ]
}

resource "aws_api_gateway_method_response" "opt_method_response_200" {
  resource_id = aws_api_gateway_resource.api_gateway_resource.id
  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
  http_method = aws_api_gateway_method.opt_method.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
  response_models = {
    "application/json" = "Empty"
  }

  depends_on = [
    aws_api_gateway_method.opt_method
  ]
}

resource "aws_api_gateway_integration_response" "opt_int_response_200" {
  resource_id = aws_api_gateway_resource.api_gateway_resource.id
  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
  http_method = aws_api_gateway_method.opt_method.http_method
  status_code = aws_api_gateway_method_response.opt_method_response_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [
    aws_api_gateway_method_response.opt_method_response_200
  ]
}

#API Gateway Stage Deployment
resource "aws_api_gateway_deployment" "pricing_agw_deploy" {
  rest_api_id = aws_api_gateway_rest_api.api_gateway.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.ec2_pricing.id,
      aws_api_gateway_method.get_method.id,
      aws_api_gateway_method.opt_method.id,
      aws_api_gateway_integration.get_integration.id,
      aws_api_gateway_integration.opt_integration.id,
      aws_api_gateway_method_response.get_method_response_200.id,
      aws_api_gateway_method_response.opt_method_response_200.id,
      aws_api_gateway_integration_response.get_int_response_200.id,
      aws_api_gateway_integration_response.opt_int_response_200.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "pricing_agw_stage" {
  deployment_id = aws_api_gateway_deployment.pricing_agw_deploy.id
  rest_api_id   = aws_api_gateway_rest_api.api_gateway.id
  stage_name    = "prod"
}