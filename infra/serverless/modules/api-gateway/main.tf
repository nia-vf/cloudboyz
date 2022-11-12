#API Gateway Resource
resource "aws_api_gateway_resource" "api_gateway_resource" {
  parent_id   = var.root_resource_id
  rest_api_id = var.id
  path_part   = var.resource_name
}

#API Gateway GET Resource
resource "aws_api_gateway_method" "get_method" {
  resource_id   = aws_api_gateway_resource.api_gateway_resource.id
  rest_api_id   = var.id
  authorization = "NONE"
  http_method   = "GET"
  request_parameters = {
    "method.request.querystring.instanceType" = true
    "method.request.querystring.region"       = true
  }
}

resource "aws_api_gateway_integration" "get_integration" {
  resource_id             = aws_api_gateway_resource.api_gateway_resource.id
  rest_api_id             = var.id
  http_method             = aws_api_gateway_method.get_method.http_method
  integration_http_method = "POST"
  type                    = "AWS"
  uri                     = var.lambda_function_invoke_arn

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
    aws_api_gateway_method.get_method
    #, module.lambda_function
  ]
}

resource "aws_api_gateway_method_response" "get_method_response_200" {
  resource_id = aws_api_gateway_resource.api_gateway_resource.id
  rest_api_id = var.id
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
  rest_api_id = var.id
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
  rest_api_id   = var.id
  authorization = "NONE"
  http_method   = "OPTIONS"
}

resource "aws_api_gateway_integration" "opt_integration" {
  resource_id = aws_api_gateway_resource.api_gateway_resource.id
  rest_api_id = var.id
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
  rest_api_id = var.id
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
  rest_api_id = var.id
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
  rest_api_id = var.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.api_gateway_resource.id,
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
  rest_api_id   = var.id
  stage_name    = "prod"
}

#Lambda IAM Permissions for API Gateway
data "aws_caller_identity" "current" {}

locals {
  account_id = data.aws_caller_identity.current.account_id
}

output "account_id" {
  value = local.account_id
}

data "aws_region" "current" {}

locals {
  region = data.aws_region.current.name
}

output "region" {
  value = local.region
}

resource "aws_lambda_permission" "pricing_agw_perm" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:${local.region}:${local.account_id}:${var.id}/*/${aws_api_gateway_method.get_method.http_method}${aws_api_gateway_resource.api_gateway_resource.path}"
}