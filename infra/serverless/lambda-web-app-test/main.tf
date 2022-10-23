terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "us-east-1"
}

#Lambda IAM Role
resource "aws_iam_role" "iam_role_for_lambda" {
  name = "iam_role_for_lambda"

  assume_role_policy = <<EOS
    {
    "Version": "2012-10-17",
    "Statement": [
        {
        "Action": "sts:AssumeRole",
        "Principal": {
            "Service": "lambda.amazonaws.com"
        },
        "Effect": "Allow",
        "Sid": ""
        }
      ]
    }
  EOS
}

#Lambda Functon Setup
resource "aws_lambda_function" "weather_app_lambda" {
  filename      = "package.zip"
  function_name = "weather_app_lambda"
  role          = aws_iam_role.iam_role_for_lambda.arn
  handler       = "index.handler"

  source_code_hash = filebase64sha256("package.zip")

  runtime = "nodejs16.x"
}

#Lambda IAM Permissions
resource "aws_lambda_permission" "weather_app_lambda_perm" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.weather_app_lambda.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:${var.my_region}:${var.account_id}:${aws_api_gateway_rest_api.weather_app_agw.id}/*/${aws_api_gateway_method.get_method.http_method}${aws_api_gateway_resource.forecast_data.path}"
}

#API Gateway Setup
resource "aws_api_gateway_rest_api" "weather_app_agw" {
  name = "weather_app_agw"
  # endpoint_configuration {
  #   types = [ "REGIONAL" ]
  # }
}

#API Gateway GET Resource
resource "aws_api_gateway_resource" "forecast_data" {
  parent_id   = aws_api_gateway_rest_api.weather_app_agw.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.weather_app_agw.id
  path_part   = "forecast-data"
}

resource "aws_api_gateway_method" "get_method" {
  resource_id   = aws_api_gateway_resource.forecast_data.id
  rest_api_id   = aws_api_gateway_rest_api.weather_app_agw.id
  authorization = "NONE"
  http_method   = "GET"
  request_parameters = {
    "method.request.querystring.location"  = true
    "method.request.querystring.unitGroup" = true
    "method.request.querystring.include"   = false
  }
}

resource "aws_api_gateway_integration" "get_integration" {
  resource_id             = aws_api_gateway_resource.forecast_data.id
  rest_api_id             = aws_api_gateway_rest_api.weather_app_agw.id
  http_method             = aws_api_gateway_method.get_method.http_method
  integration_http_method = "POST"
  type                    = "AWS"
  uri                     = aws_lambda_function.weather_app_lambda.invoke_arn

  request_templates = {
    "application/json" = <<MAPPING_TEMPLATE
    {
     "location": "$input.params('location')",
     "unitGroup": "$input.params('unitGroup')",
     "include": "$input.params('include')"
    }
    MAPPING_TEMPLATE
  }
  passthrough_behavior = "WHEN_NO_TEMPLATES"

  depends_on = [
    aws_api_gateway_method.get_method, aws_lambda_function.weather_app_lambda
  ]
}

resource "aws_api_gateway_method_response" "method_response_200" {
  resource_id = aws_api_gateway_resource.forecast_data.id
  rest_api_id = aws_api_gateway_rest_api.weather_app_agw.id
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

resource "aws_api_gateway_integration_response" "int_response_200" {
  resource_id = aws_api_gateway_resource.forecast_data.id
  rest_api_id = aws_api_gateway_rest_api.weather_app_agw.id
  http_method = aws_api_gateway_method.get_method.http_method
  status_code = aws_api_gateway_method_response.method_response_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

  # depends_on = [
  #   aws_api_gateway_method_response.method_response_200, aws_api_gateway_method.get_method
  # ]
}

#API Gateway OPTIONS Resource
resource "aws_api_gateway_method" "opt_method" {
  resource_id   = aws_api_gateway_resource.forecast_data.id
  rest_api_id   = aws_api_gateway_rest_api.weather_app_agw.id
  authorization = "NONE"
  http_method   = "OPTIONS"
}

resource "aws_api_gateway_integration" "opt_integration" {
  resource_id             = aws_api_gateway_resource.forecast_data.id
  rest_api_id             = aws_api_gateway_rest_api.weather_app_agw.id
  http_method             = aws_api_gateway_method.opt_method.http_method
  type                    = "MOCK"

  request_templates = {
    "application/json" = <<MAPPING_TEMPLATE
    {
      "statusCode": 200
    }
    MAPPING_TEMPLATE
  }
  passthrough_behavior = "WHEN_NO_MATCH"

  depends_on = [aws_api_gateway_method.opt_method]
}

resource "aws_api_gateway_method_response" "opt_method_response_200" {
  resource_id = aws_api_gateway_resource.forecast_data.id
  rest_api_id = aws_api_gateway_rest_api.weather_app_agw.id
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

  depends_on = [aws_api_gateway_method.opt_method]
}

resource "aws_api_gateway_integration_response" "opt_int_response_200" {
  resource_id = aws_api_gateway_resource.forecast_data.id
  rest_api_id = aws_api_gateway_rest_api.weather_app_agw.id
  http_method = aws_api_gateway_method.opt_method.http_method
  status_code = aws_api_gateway_method_response.opt_method_response_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [aws_api_gateway_method_response.opt_method_response_200]
}

resource "aws_api_gateway_deployment" "weather_app_agw_deploy" {
  rest_api_id = aws_api_gateway_rest_api.weather_app_agw.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.forecast_data.id,
      aws_api_gateway_method.get_method.id,
      aws_api_gateway_method.opt_method.id,
      aws_api_gateway_integration.get_integration.id,
      aws_api_gateway_integration.opt_integration.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "weather_app_agw_stage" {
  deployment_id = aws_api_gateway_deployment.weather_app_agw_deploy.id
  rest_api_id   = aws_api_gateway_rest_api.weather_app_agw.id
  stage_name    = "prod"
}