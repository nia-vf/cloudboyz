const {
    ClientSecretCredential,
    DefaultAzureCredential
} = require("@azure/identity")
const {
    ResourceSkus,
    ResourceSkusListOptionalParams,
    ComputeManagementClient,
} = require("@azure/arm-compute")
const dotenv = require("dotenv")
const _ = require("lodash")

dotenv.config({ path: __dirname + "/./../../../../../.env" });

let credentials = null;

const tenantId = process.env["AZURE_TENANT_ID"];
const clientId = process.env["AZURE_CLIENT_ID"];
const clientSecret = process.env["AZURE_CLIENT_SECRET"];
const subscriptionId = process.env["AZURE_SUBSCRIPTION_ID"]

if (tenantId && clientId && clientSecret) {
    //console.log("development");
    credentials = new ClientSecretCredential(tenantId, clientId, clientSecret);
} else {
    credentials = new DefaultAzureCredential();
}

async function listResourceSkus() {
    try {
        //Use credential to authneticate with Azure SDKs
        const client = new ComputeManagementClient(credentials, subscriptionId)

        //list Resource Skus for subscription
        for await (const item of client.resourceSkus.list({
            filter: "location eq 'uksouth'"
        })) {
            console.log(item)
        }
    } catch (err) {
        console.error(JSON.stringify(err))
    }
}

listResourceSkus()