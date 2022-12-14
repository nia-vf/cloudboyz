# Setting up Credentials for Listing Resource SKUs via Azure SDK

## Why Resource SKU Details are required for Pricing Data

Unlike AWS, we cannot access all the Virtual Machine pricing information we need from a single Pricing API endpoint.

To get information about a Virtual Machine instance’s size, memory capacity, vCPUs, etc. we must use the [List Resource SKUs API ](https://learn.microsoft.com/en-us/rest/api/compute/resource-skus/list?tabs=HTTP)

## How to set up Credentials to call get Resource SKU Details

The List Resource SKUs API retrieves a list of Compute SKUs available for a Subscription. Because this data is tied to a Subscription, firstly we will need to create a subscription in Azure, and secondly we will need to create credentials tied to this subscription.

To create the required Credentials, we must:

1. Create a Service Principal
2. Create a Custom Role with the required permission
3. Create a Role Assignment to assign the Custom Role to Service Principal

### Prequisites

Before we can create our Credentials we must ensure than we have Azure Active Directory set up on the account associated with our Subscription.

### Create a Service Principal

Easiest way to create a Service Principal to use Cloud Shell from the Azure Portal or from the command line using Azure CLI. In this example, we will use Cloud Shell.

Before creating our Service Principal, lets run this command to show the details of the current subscription – `az account show`

![image](https://user-images.githubusercontent.com/102545622/205440844-ce28b52f-d4b0-45be-95d3-130721d466ba.png)

Take note of the `id` and `tenantid`.

Now run this command – `az ad sp create-for-rbac --name='service_principal_name'`

![image](https://user-images.githubusercontent.com/102545622/205440910-aca27d71-21a3-4849-a96a-9c1f6eda7706.png)

This command will return an object with the following fields:

- `appId` – this is the Service Principal Client ID
- `displayName` – the name you gave to your Service Principal
- `password` – this is the Service Principal Client Secret
- `tenant` – this is the Tenant ID, and should match the `tenantId` from the previous step

Take note of this information as we will need it later. Our Service Principal has now been created. We can view it in the Azure Portal by navigating to 'Azure Active Directory' and going to the 'App Registrations' blade on the left navigation menu. Our Service Principal can easily be found under the ‘Owned applications’ tab.

![image](https://user-images.githubusercontent.com/102545622/205441068-63b79a41-406e-4d92-b94c-7d69b09d5b3c.png)

### Create a Custom Role with the required permissions

Rather than using an OOTB Microsoft role, we want to create a Custom Role with the specific permission to list Resource SKUs. Typically, the OOTB roles provide more privileges than we need.

To create a Custom Role, navigate to 'Subscriptions' from the main search bar at the top, and select the Subscription with the Subscription ID that matches the value of the `id` field from the `azure account show` command we ran earlier.

![image](https://user-images.githubusercontent.com/102545622/205441710-c8b69fa1-9066-4703-b4da-9e5a48051275.png)

Under the Subscription, select the 'Access Control (IAM)' blade from the left navigation menu. Navigate to the Roles tab, and select 'Add' to create a Custom Role.

![image](https://user-images.githubusercontent.com/102545622/205442623-8e35a80f-4f33-4362-9490-6dde1e257750.png)

From the dropdown, select 'Add custom role'.

![image](https://user-images.githubusercontent.com/102545622/205442672-e54f9ec6-8fae-4b18-8cec-117fd88a5d49.png)

Under the 'Basics' tab, give the Custom Role a name, like 'List-Resource-Skus' for example, and give it a description that makes sense, such as: 'A Role containing permissions to access the List Resource Skus API'.

Under the 'Permissions' tab, click on 'Add Permissions'. This brings up a box from the right like the one we see below. Type 'Microsoft.Compute/skus/read' in the search bar. This is the permission we require.

![image](https://user-images.githubusercontent.com/102545622/205442710-08173436-5a9c-4f49-bbdd-084156d265fb.png)

Select the 'Microsoft Compute' box, and this will bring up the Skus/read permission. Check the tickbox and click 'Add' to add the permission to our Custom Role.

![image](https://user-images.githubusercontent.com/102545622/205442724-e1200ed2-a69a-4054-8844-b3882af702a2.png)

Now click on 'Review + Create' and create the Custom Role. We can view our Custom Role in the 'Access control (IAM)' blade under the 'Roles' tab.

![image](https://user-images.githubusercontent.com/102545622/205442745-e85ede76-0f93-445f-80c6-1cf10eb5ebe9.png)

### Create a Role Assignment to assign the Custom Role to Service Principal

Now we must assign our Custom Role to our Service Principal, so we can use this Service Principal to access the List Resource SKUs API from our Application via the Azure SDK.

To create a role assignment, again from the 'Access Control (IAM)' blade, select the 'Role Assignments' tab.

![image](https://user-images.githubusercontent.com/102545622/205443716-d10e513d-5feb-4286-9855-db38fc767289.png)

Click 'Add' and then 'Add role assignment' from the dropdown.

![image](https://user-images.githubusercontent.com/102545622/205443743-89ecf42a-81b5-4a86-888e-6b520087f794.png)

Under the 'Role' tab, select the Custom role we created earlier:

![image](https://user-images.githubusercontent.com/102545622/205443773-caa050d6-f366-473c-b429-ed044abb5459.png)

Under the 'Members' tab, click on 'Select Members'. Again, we get a pop-up box on the right, and here search for the Service Principal we created earlier:

![image](https://user-images.githubusercontent.com/102545622/205443798-4307be87-9e24-433f-bd7c-ca75636d3068.png)

Click on 'Review + assign' to create Role Assignment.

Now our Azure Credentials are set up. However, to use this in our code with the Azure SDK there are some further steps, both locally and remotely (via a lambda function for example).

## Using Credentials Locally

To use the Credentials on our local machine, we must create a `.env` file in the root of the CloudBoyz directory. This file must contain the following 4 lines:

```shell
AZURE_SUBSCRIPTION_ID="{subscription_id_string}"
AZURE_TENANT_ID="{tenant_id_string}"
AZURE_CLIENT_ID="{client_id_string}"
AZURE_CLIENT_SECRET="{client_secret_string}"
```

Where:

- AZURE_SUBSCRIPTION_ID is the Subscription ID string we created our Role and Role Assignment in (this is the `id` from the `az account show` step)
- AZURE_TENANT_ID is the Tenant ID string for the Service Principal we created (`tenant` field)
- AZURE_CLIENT_ID is the Client ID string for the Service Principal we created (`appId` field)
- AZURE_CLIENT_SECRET is the Client Secret string for the Service Principal we created (`password` field)

## Using Credentials Remotely

We will also want to use the Credentials remotely (i.e., on our applications hosted in AWS), not just in Production, but for Development too. To use the Credentials remotely in our applications hosted in the Cloud, we must create a Secret in AWS Secrets Manager in the account and region associated with our application.

To create a Secret, navigate to Secrets Manager in the AWS Console using the search bar at the top. In Secrets Manager, select 'Store a new secret'.

Under 'Step 1 - Choose a secret type', we first want to select the Secret type. Choose 'Other type of secret' as shown in the image below. We must then add 4 key/value pairs that match what we put in our local `.env` file above:

![image](https://user-images.githubusercontent.com/102545622/205488887-7985dfa2-b070-4f3a-9bea-fd3578a95a72.png)

Click 'Next'.

Under 'Step 2 - Configure secret', we will give the secret a name and description. The name MUST be 'prod/pricing-comparison/instance/azure-creds', and the description can optionally be added as in the example below:

![image](https://user-images.githubusercontent.com/102545622/205489232-15ef4fc5-e6d8-43ca-a204-7f8189b0bea5.png)

No further configuration is required for Step 3 and 4, so we can go ahead and press 'Next' and then review and create the secret by clicking on 'Store'.

### Secrets Manager Permissions for Lambda

In this example, our Lambda function will be using this Secret, therefore we must not forget to give the function the appropriate permissions to access the Secret. The following permissions must be added the Lambda Execution Role:

- `secretsmanager:GetSecretValue`
