# Setting up Credentials for Listing Resource SKUs via Azure SDK

## Why Resource SKU Details are required for Pricing Data

Unlike AWS, we cannot access all the Virtual Machine pricing information we need from a single Pricing API endpoint.

To get information about a Virtual Machine instance’s size, memory capacity, vCPUs, etc. we must use the [List Resource SKUs API ](https://learn.microsoft.com/en-us/rest/api/compute/resource-skus/list?tabs=HTTP)

## How to set up Credentials to call get Resource SKU Details

The List Resource SKUs API retrieves a list of Compute SKUs available for a Subscription. Because this data is tied to a Subscription, firstly you’ll need to create a subscription in Azure, and secondly you will need to create credentials tied to this subscription.

To create the required Credentials, we must:

1. Create a Service Principal
2. Create a Custom Role with the required permission
3. Create a Role Assignment

### Prequisites

Before we can create our Credentials we must ensure than we have Azure Active Directory set up on the account associated with our Subscription. **Arns to insert steps in separate README**

#### Create a Service Principal

Easiest way to create a Service Principal to use Cloud Shell from the Azure Portal or from the command line using Azure CLI. In this example, we will use Cloud Shell.

Before creating our Service Principal, lets run this command to show the details of the current subscription – `az account show`
![image](https://user-images.githubusercontent.com/102545622/205440844-ce28b52f-d4b0-45be-95d3-130721d466ba.png)
Take note of the `id` and `tenantid`.

Now run this command – `az ad sp create-for-rbac --name='service_principal_name'`
![image](https://user-images.githubusercontent.com/102545622/205440910-aca27d71-21a3-4849-a96a-9c1f6eda7706.png)

This command will return an object with the following fields:

-	`appId` – this is the Service Principal Client ID
-	`displayName` – the name you gave to your Service Principal
-	`password` – this is the Service Principal Client Secret
-	`tenant` – this is the Tenant ID, and should match the `tenantId` from the previous step

Take note of this information as we will need it later. Our Service Principal has now been created. We can view it in the Azure Portal by navigating to ‘Azure Active Directory’ and going to the ‘App Registrations’ blade on the left navigation menu. Our Service Principal can easily be found under the ‘Owned applications’ tab.
![image](https://user-images.githubusercontent.com/102545622/205441068-63b79a41-406e-4d92-b94c-7d69b09d5b3c.png)



#### 

## Using Credentials Locally

## Using Credentials via Lmabda
