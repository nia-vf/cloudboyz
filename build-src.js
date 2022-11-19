var esBuild = require("esbuild");
var admZip = require("adm-zip");
var fs = require("fs");
var path = require("path");

const rootDir = __dirname.replace(/\\/g, "/");
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

function getServices(paths, dirPath) {
  let services = [];
  paths.forEach((servicePath) => {
    dirPath = dirPath.replace(/\//g, "\\");
    servicePath = servicePath.split(dirPath)[1];
    services.push(servicePath);
  });
  return services;
}

function bundleAppCode(services, esBuild) {
  var dists = [];
  services.forEach((service) => {
    servicePath = srcDirPath + service.replace(/\\/g, "/");
    //console.log(servicePath)
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
  });
  return dists;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitSomeTime() {
  await sleep(5000);
}

async function zipAppCode(esBuildOutput) {
  await sleep(5000);
  console.log("Waited 5 seconds");

  esBuildOutput.forEach((file) => {
    var data = fs.readFileSync(file);
    //var content = "what a pile of rubbbish"
    var content = data;
    var zip = new admZip();
    zip.addFile("index.js", Buffer.from(content, "utf8"));
    zip.writeZip(file.split("/index.js")[0] + "/index.zip");
    console.log("index.zip written to '" + file.split("/index.js")[0] + "'");
  });
}

var folders = getPaths(srcDirPath);
var services = getServices(folders, srcDirPath);
var esBuildOutput = bundleAppCode(services, esBuild);
console.log(esBuildOutput);
zipAppCode(esBuildOutput);
