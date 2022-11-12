[ Changelog ]

- Created api-gateway module to encapsulate and abstract the creation of API Gateway Resources
- Moved terraform resources for API Gateway into api-gateway module
- These terraform resources include:
  - API Gateway Resource
  - API Gateway Resource GET Method
  - API Gateway Resource GET Integration
  - API Gateway Resource GET Method Response
  - API Gateway Resource GET Integration Response
  - API Gateway Resource OPTIONS Method
  - API Gateway Resource OPTIONS Integration
  - API Gateway Resource OPTIONS Method Response
  - API Gateway Resource OPTIONS Integration Response
  - API Gateway Resource Stage
  - API Gateway Resource Deployment
  - Lambda Permission for API Gateway Resource

[ Notes ]

- There may be a chance that we remove or refine this module at a later stage as the Pricing Web App grows. Though the creation of this module has decluttered the main.tf for the Web App infrastructure, this module was primarily created for learning purposes.
