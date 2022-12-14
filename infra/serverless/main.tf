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
  local_existing_package = "../../dist/serverless-pricing/index.zip"

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
  local_existing_package = "../../dist/instance-pricelist/aws/index.zip"
  #local_existing_package = "../../dist/index.zip"

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

#API Gateway - EC2 Pricing
module "ec2_pricing_agw" {
  source = "./modules/api-gateway"

  id               = aws_api_gateway_rest_api.api_gateway.id
  root_resource_id = aws_api_gateway_rest_api.api_gateway.root_resource_id
  resource_name    = "ec2-pricing"

  lambda_function_name       = module.ec2_pricing_lambda.lambda_function_name
  lambda_function_invoke_arn = module.ec2_pricing_lambda.lambda_function_invoke_arn

  depends_on = [
    module.ec2_pricing_lambda
  ]


}

#API Gateway AWS Instance Pricelist
module "aws_instance_pricelist_agw" {
  source = "./modules/api-gateway"

  id               = aws_api_gateway_rest_api.api_gateway.id
  root_resource_id = aws_api_gateway_rest_api.api_gateway.root_resource_id
  resource_name    = "instance-pricelist"

  lambda_function_name       = module.aws_instance_pricelist_lambda.lambda_function_name
  lambda_function_invoke_arn = module.aws_instance_pricelist_lambda.lambda_function_invoke_arn

  depends_on = [
    module.aws_instance_pricelist_lambda
  ]
}


output "region" {
  value = module.aws_instance_pricelist_agw.region
}

output "account_id" {
  value = module.aws_instance_pricelist_agw.account_id
}

#API Gateway Stage Deployment
resource "aws_api_gateway_deployment" "pricing_agw_deploy" {
  rest_api_id = aws_api_gateway_rest_api.api_gateway.id

  triggers = {
    redeployment = sha1(jsonencode([
      module.ec2_pricing_agw.resource_id,
      module.ec2_pricing_agw.get_method_id,
      module.ec2_pricing_agw.opt_method_id,
      module.ec2_pricing_agw.get_integration_id,
      module.ec2_pricing_agw.opt_integration_id,
      module.ec2_pricing_agw.get_method_res200_id,
      module.ec2_pricing_agw.opt_method_res200_id,
      module.ec2_pricing_agw.get_integration_res200_id,
      module.ec2_pricing_agw.opt_integration_res200_id,
      module.aws_instance_pricelist_agw.resource_id,
      module.aws_instance_pricelist_agw.get_method_id,
      module.aws_instance_pricelist_agw.opt_method_id,
      module.aws_instance_pricelist_agw.get_integration_id,
      module.aws_instance_pricelist_agw.opt_integration_id,
      module.aws_instance_pricelist_agw.get_method_res200_id,
      module.aws_instance_pricelist_agw.opt_method_res200_id,
      module.aws_instance_pricelist_agw.get_integration_res200_id,
      module.aws_instance_pricelist_agw.opt_integration_res200_id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    module.ec2_pricing_agw,
    module.aws_instance_pricelist_agw
  ]
}

resource "aws_api_gateway_stage" "pricing_agw_stage" {
  deployment_id = aws_api_gateway_deployment.pricing_agw_deploy.id
  rest_api_id   = aws_api_gateway_rest_api.api_gateway.id
  stage_name    = "prod"

  depends_on = [
    aws_api_gateway_deployment.pricing_agw_deploy
  ]
}
