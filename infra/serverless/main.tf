module "lambda_function" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "my-lambda1"
  description   = "My awesome lambda function"
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
    Name = "my-lambda1"
  }
}