To run this locally you'll need:
- to be configured with AWS (Can use the aws cli commands via a user or your own credentials)

Command to package the lambda function AND run terraform to deploy the lambda and it's required infrastructure on AWS:
```
// This command wraps several other command which do the following:
// - Create .js files for each .ts file in the dir src/lambdas/serverless-prcing/*
// - Zip these .js files into a index.zip
// - Deploys the packaged .zip of node/js with it's dependencies to AWS as a lambda functions (permissions automatically handled)

cloudboyz % > yarn full-release
```