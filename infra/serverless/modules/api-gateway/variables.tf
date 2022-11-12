variable "name" {
  description = "Name of the api-gateway to create"
  type        = string
}

variable "resource_name" {
  description = "Name of the API resource, also defined as the path part"
  type = string
  default = "ec2-pricing"
}

variable "lambda_function_invoke_arn" {
  description = "Invoke ARN of Lambda function to associate with API Gateway GET resource"
  type = string
}