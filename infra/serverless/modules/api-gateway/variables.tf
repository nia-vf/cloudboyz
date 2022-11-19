variable "id" {
    description = "ID of the API Gateway to create Resources for"
    type = string
}

variable "root_resource_id" {
  description = "Root Resource ID of the API Gateway to create Resources for"
  type = string
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

variable "lambda_function_name" {
  description = "Name of Lambda function to associate with API Gateway GET resource"
  type = string
}