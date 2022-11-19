########################################################################################
# LAMBDA SETUP
########################################################################################

#Lambda Function
module "lambda_function" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "serverless-pricing-api"
  description   = "Proof of concept for a serverless lambda to retrieve formatted api responses utilizing the client-pricing sdk"
  handler       = "index.handler"
  runtime       = "nodejs16.x"

  create_package         = false
  local_existing_package = "../../dist/index.zip"

  timeout = 60

  attach_policy_statements = true
  policy_statements = {
    pricing = {
      effect    = "Allow",
      actions   = ["pricing:GetProducts"],
      resources = ["*"]
    },
  }

  tags = {
    Name = "serverless-pricing"
  }
}

########################################################################################
# API GATEWAY SETUP
########################################################################################

#API Gateway
resource "aws_api_gateway_rest_api" "api_gateway" {
  name = "serveress-pricing-api-gateway"
}

module "price_api_gateway" {
  source = "./modules/api-gateway"

  id               = aws_api_gateway_rest_api.api_gateway.id
  root_resource_id = aws_api_gateway_rest_api.api_gateway.root_resource_id
  resource_name    = "ec2-pricing"

  lambda_function_name       = module.lambda_function.lambda_function_name
  lambda_function_invoke_arn = module.lambda_function.lambda_function_invoke_arn
}

output "region" {
  value = module.price_api_gateway.region
}

output "account_id" {
  value = module.price_api_gateway.account_id
}