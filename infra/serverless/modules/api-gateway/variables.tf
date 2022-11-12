variable "name" {
  description = "Name of the api-gateway to create"
  type        = string
}

variable "resource_name" {
  description = "Name of the API resource, also defined as the path part"
  type = string
  default = "ec2-pricing"
}