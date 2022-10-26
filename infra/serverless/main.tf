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
