########################################################################################
# LAMBDA SETUP
########################################################################################

#Lambda Function
module "ec2_pricing_lambda" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "serverless-pricing-api"
  description   = "Proof of concept for a serverless lambda to retrieve formatted api responses utilizing the client-pricing sdk"
  handler       = "index.handler"
  runtime       = "nodejs16.x"

  create_package         = false
  local_existing_package = "../../dist/ec2-pricing/index.zip"

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

module "aws_instance_pricelist_lambda" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "aws-instance-pricelist"
  description   = "Proof of concept for a serverless lambda to retrieve formatted api responses utilizing the client-pricing sdk"
  handler       = "index.handler"
  runtime       = "nodejs16.x"

  create_package         = false
  local_existing_package = "../../dist/instance-pricelist/index.zip"

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
    Name = "aws-instance-pricelist"
  }
}

########################################################################################
# API GATEWAY SETUP
########################################################################################

#API Gateway
resource "aws_api_gateway_rest_api" "api_gateway" {
  name = "pricing-api-gateway"
}

module "ec2_pricing_agw" {
  source = "./modules/api-gateway"

  id               = aws_api_gateway_rest_api.api_gateway.id
  root_resource_id = aws_api_gateway_rest_api.api_gateway.root_resource_id
  resource_name    = "ec2-pricing"

  lambda_function_name       = module.ec2_pricing_lambda.lambda_function_name
  lambda_function_invoke_arn = module.ec2_pricing_lambda.lambda_function_invoke_arn
}

module "aws_instance_pricelist_agw" {
  source = "./modules/api-gateway"

  id               = aws_api_gateway_rest_api.api_gateway.id
  root_resource_id = aws_api_gateway_rest_api.api_gateway.root_resource_id
  resource_name    = "instance-pricelist"

  lambda_function_name       = module.aws_instance_pricelist_lambda.lambda_function_name
  lambda_function_invoke_arn = module.aws_instance_pricelist_lambda.lambda_function_invoke_arn
}


output "region" {
  value = module.ec2_pricing_agw.region
}

output "account_id" {
  value = module.ec2_pricing_agw.account_id
}