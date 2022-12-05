import admZip from "adm-zip";
import path from "path";
import fs from "fs";
import esBuild from "esbuild";
import _ from "lodash";

/**
 * Function that replaces file path backslashes with forward slashes (Resolves windows usage)
 * @param    {String} path Path containing backslashes
 * @return   {String}      Formatted path
 */
const windowsReplace = (path: string): string => {
  return path.replace(/\\/g, "/");
};

const rootDir = windowsReplace(path.join(__dirname, ".."));
const srcDirPath = rootDir + "/src/lambdas";

type HandlerFilePaths = string[];

/**
 * Function that gets a list of `full paths` to lambda handler.ts files
 * @param    {String} srcDirPath Source directory to recursively explore for handler.ts files
 * @param    {String} handlerFilePaths Array of paths to lambda handler.ts files. Passed back into the function recursively. Undefined by default
 * @return   {String}            Array of paths to lambda handler.ts files
 */
const getPaths = (
  srcDirPath: string,
  handlerFilePaths?: HandlerFilePaths
): HandlerFilePaths => {
  const files = fs.readdirSync(srcDirPath);
  let handlerPaths = handlerFilePaths ? handlerFilePaths : [];

  files.forEach((file: string) => {
    if (fs.statSync(srcDirPath + "/" + file).isDirectory()) {
      handlerPaths = getPaths(srcDirPath + "/" + file, handlerPaths);
    } else {
      handlerPaths.push(path.join(srcDirPath, "/", file));
    }
  });

  //Filter for only handlerPaths ending handler.ts
  let filteredHandlerPaths = _.filter(handlerPaths, function(path){
    return _.endsWith( path, "\\handler.ts" )
  })
  return filteredHandlerPaths;
};

/**
 * Function to parse the lambda name from a path string
 *
 * @param    {String} path Path string containing lambda name
 * @return   {String}      Lambda name string. E.g. `hello-world`, `hello-world/simplified`
 */
const getLambdaName = (path: string): string => {
  const lambdaPath = windowsReplace(path).replace(srcDirPath, "");
  return `${lambdaPath.split("/handler.ts")[0]}`;
};

/**
 * Function that bundles provided typescript handler paths into minimized .js files and moves to distinct dist folder locations
 * @param    {String} lambdaPaths Array of paths to handler.ts files
 * @return   {String}             List of paths to bundles.js files in the dist folder
 */
const bundleAppCode = (lambdaPaths: string[]): string[] => {
  const dists: string[] = [];
  lambdaPaths.forEach((lambdaFullPath: string) => {
    const lambdaName = getLambdaName(lambdaFullPath);
    console.log("CURRENT LAMBDA BEING BUILT", lambdaName);
    esBuild
      .build({
        entryPoints: [lambdaFullPath],
        bundle: true,
        minify: true,
        sourcemap: true,
        platform: "node",
        target: "es2020",
        outfile: rootDir + "/dist" + `${lambdaName}` + "/index.js",
      })
      .catch((error: Error) => process.exit(1));
    dists.push(rootDir + "/dist" + `${lambdaName}` + "/index.js");
    console.log(
      "'" + rootDir + "/dist" + `${lambdaName}` + "/index.js' created."
    );
  });
  console.log("List of created dist index.js files: ", dists);
  return dists;
};

/**
 * Function that pauses execution of a script
 * @param    {String} ms Amount of time in milliseconds to pause execution
 */
const sleep = async (ms: number) => {
  const waitTimeInSeconds = ms / 1000;
  console.log(`Waiting ${waitTimeInSeconds} seconds`);
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Function that zips code in the provided path list into .zip files
 * @param    {String} pathsToZip Paths containing .js code to zip
 */
const zipAppCode = async (pathsToZip: string[]) => {
  await sleep(3000);
  console.log(
    "Dist directory now exists. Continuing zip processing of underlying directories"
  );

  const zipList: string[] = [];
  pathsToZip.forEach((file: string) => {
    const data = fs.readFileSync(file);
    const content = data;
    const zip = new admZip();
    zip.addFile("index.js", Buffer.from(content));
    zip.writeZip(file.split("/index.js")[0] + "/index.zip");
    console.log("index.zip written to '" + file.split("/index.js")[0] + "'");
    zipList.push(file.split("/index.js")[0] + "/index.zip");
  });
  console.log("List of created dist index.zip files: ", zipList);
};

const main = () => {
  console.log("ROOT DIRECTORY:", rootDir);
  const lambdaPaths = getPaths(srcDirPath);
  console.log("List of existing lambda paths (handler.ts): ", lambdaPaths);
  const esBuildOutput = bundleAppCode(lambdaPaths);
  zipAppCode(esBuildOutput);
};

main();
