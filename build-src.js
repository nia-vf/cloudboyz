var esBuild = require("esbuild");
var admZip = require("adm-zip");
var fs = require("fs");
var path = require("path");

const rootDir = __dirname.replace(/\\/g, "/"); //where we see 'replace(/\\/g, "/")' this is to handle paths using backslashes rather than forward slashes
const srcDirPath = rootDir + "/src/lambdas";
const distDirPath = rootDir + "/dist";

function getPaths(dirPath, arrayFiles) {
  var files = fs.readdirSync(dirPath);
  var arrayFiles = arrayFiles || [];

  files.forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayFiles = getPaths(dirPath + "/" + file, arrayFiles);
    } else {
      arrayFiles.push(path.join(dirPath, "/", file));
    }
  });
  return arrayFiles;
}

//Get list of Services
function getServices(paths, dirPath) {
  let services = [];
  paths.forEach((servicePath) => {
    dirPath = dirPath.replace(/\//g, "\\"); //change forward-slash to backslash
    servicePath = servicePath.split(dirPath)[1];
    services.push(servicePath);
  });
  console.log("List of existing services: ", services);
  return services;
}

//Bundle handler.ts files and output them in dist directory as index.js files
//This is a recursive function to identify ALL handler.ts files in our src/lambdas directory
function bundleAppCode(services, esBuild) {
  var dists = [];
  services.forEach((service) => {
    servicePath = srcDirPath + service.replace(/\\/g, "/");
    serviceName = service.replace(/\\/g, "/").split("/handler.ts")[0];
    esBuild
      .build({
        entryPoints: [servicePath],
        bundle: true,
        minify: true,
        sourcemap: true,
        platform: "node",
        target: "es2020",
        outfile: rootDir + "/dist" + serviceName + "/index.js",
      })
      .catch((error) => process.exit(1));
    dists.push(rootDir + "/dist" + serviceName + "/index.js");
    console.log("'" + rootDir + "/dist" + serviceName + "/index.js' created.");
  });
  console.log("List of created dist index.js files: ", dists);
  return dists;
}

//Wait 5 seconds - to allow for new dist directories to become available
function sleep(ms) {
  console.log("Waiting 5 seconds");
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//Zip index.js files into index.zip files
async function zipAppCode(esBuildOutput) {
  await sleep(5000);
  console.log("Waited 5 seconds");

  var zipList = [];
  esBuildOutput.forEach((file) => {
    var data = fs.readFileSync(file);
    var content = data;
    var zip = new admZip();
    zip.addFile("index.js", Buffer.from(content, "utf8"));
    zip.writeZip(file.split("/index.js")[0] + "/index.zip");
    console.log("index.zip written to '" + file.split("/index.js")[0] + "'");
    zipList.push(file.split("/index.js")[0] + "/index.zip");
  });
  console.log("List of created dist index.zip files: ", zipList);
}

var folders = getPaths(srcDirPath);
var services = getServices(folders, srcDirPath);
var esBuildOutput = bundleAppCode(services, esBuild);
zipAppCode(esBuildOutput);
