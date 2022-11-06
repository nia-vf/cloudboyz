To run this locally you'll need:

- to be configured with AWS (Can use the aws cli commands via a user or your own credentials)

Command to package the lambda function AND run terraform to deploy the lambda and its required infrastructure on AWS:

```
// This command wraps several other commands which do the following:
// - Create .js files for each .ts file in the dir src/lambdas/serverless-pricing/*
// - Zip these .js files into an index.zip
// - Deploys the packaged .zip of node/js with its dependencies to AWS as a lambda function (permissions automatically handled)

cloudboyz % > yarn full-release
```
