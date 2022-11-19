# CloudBoyz
## package.json usage
WRT using the command `yarn build` & `yarn full-release` .  
- the command is now run with `DIR=<name of path> yarn build`
    - will build & zip a local file for the lambda location specified with DIR in dist/*index.js*
- the command is now run with `DIR=<name of path> yarn full-release`
    - will do the actions of `yarn build` and also deploy the lambda

### Example usage
`DIR=instance-pricelist/aws yarn build` .  
`DIR=instance-pricelist/aws yarn full-release` .  

DIR represented the path between lambda/ and the /handler file so for the above if we integrated the DIR param we'll have a path to files to build being `src/lambdas/instance-pricelist/aws/handler.ts` .  
