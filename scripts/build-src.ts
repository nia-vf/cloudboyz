import admZip from "adm-zip"
import path from "path"
import fs from "fs"
import esBuild from "esbuild"

// function for replacing backslashes (required when running on windows)
const windowsReplace = (path: string) => {
  return path.replace(/\\/g, "/")
}

const rootDir = windowsReplace(path.join(__dirname, '..'));
const srcDirPath = rootDir + "/src/lambdas";
const distDirPath = rootDir + "/dist";

type HandlerFilePaths = string[]

//Get list of Paths to ALL handler.ts files
//This is a recursive function to identify ALL handler.ts files in our src/lambdas directory - as some handler.ts files in nested directories
const getPaths = (dirPath: string, arrayFiles?: HandlerFilePaths): HandlerFilePaths => {
  const files = fs.readdirSync(dirPath);
  let arrFiles = arrayFiles ? arrayFiles: []

  files.forEach((file: string) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrFiles = getPaths(dirPath + "/" + file, arrFiles);
    } else {
      arrFiles.push(path.join(dirPath, "/", file));
    }
  });
  return arrFiles;
}

// Get paths for lambdas starting with at the /<service> dir level
const getLambdaName = (path: string, dirPath: string = srcDirPath) => {
  const lambdaPath = path.replace(dirPath, "")
  return `${windowsReplace(lambdaPath).split("/")[1]}`
}


//Bundle handler.ts files and output them in dist directory as index.js files
const bundleAppCode = (lambdaFullPaths: string[]) => {
  const dists: string[] = [];
  lambdaFullPaths.forEach((lambdaFullPath: string) => {
    const lambdaName = getLambdaName(lambdaFullPath)
    console.log(lambdaName)
    esBuild
      .build({
        entryPoints: [lambdaFullPath],
        bundle: true,
        minify: true,
        sourcemap: true,
        platform: "node",
        target: "es2020",
        outfile: rootDir + "/dist" + `/${lambdaName}` + "/index.js",
      })
      .catch((error: any) => process.exit(1));
    dists.push(rootDir + "/dist" + `/${lambdaName}` + "/index.js");
    console.log("'" + rootDir + "/dist" + `/${lambdaName}` + "/index.js' created.");
  });
  console.log("List of created dist index.js files: ", dists);
  return dists;
}

//Wait x seconds - to allow for new dist directories to become available
const sleep = (ms: number) => {
  const waitTimeInSeconds = ms / 1000
  console.log(`Waiting ${waitTimeInSeconds} second`);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//Zip index.js files into index.zip files
const zipAppCode = async (esBuildOutput: string[]) => {
  while(!fs.existsSync(distDirPath)) {
    await sleep(1000);
  }
  console.log("Dist directory now exists. Continuing zip processing of underlying directories");

  const zipList: string[] = [];
  esBuildOutput.forEach((file: string) => {
    const data = fs.readFileSync(file);
    const content = data;
    const zip = new admZip();
    zip.addFile("index.js", Buffer.from(content));
    zip.writeZip(file.split("/index.js")[0] + "/index.zip");
    console.log("index.zip written to '" + file.split("/index.js")[0] + "'");
    zipList.push(file.split("/index.js")[0] + "/index.zip");
  });
  console.log("List of created dist index.zip files: ", zipList);
}

console.log("ROOT DIRECTORY:", rootDir)
const lambdaFullPaths = getPaths(srcDirPath);
console.log("List of existing lambdas (by full dir path): ", lambdaFullPaths);
const esBuildOutput = bundleAppCode(lambdaFullPaths);
zipAppCode(esBuildOutput);
