# Serverless App Example - Weather Forecast API

This folder contains the infrastructure and application code for a simple application that provides weather forecast details using API Gateway, Lambda and S3.

## Functional Details

This is an application that allows users to retrieve weather forecast data via their browser. It consists of a front-end UI (client-side), and a backend using a function exposed via an API (server-side). Parameters entered by the user are passed from the front-end, to the function in the backend, which then calls an API to retrieve the weather forecast data based on the user's inputs.

The client side part of the application should sit on S3. The server side of the application sits on Lambda, exposed via API Gateway. The client-side part of the application uses the API Gateway endpoint to interact with the server-side part of the application.

Seeing as the front end (client side) contains JavaScript that manipulates data from the backend (server side) with another origin, this example application must support Cross-Origin Resource Sharing (CORS). Refer to the terraform script `main.tf` to see how the API Gateway infrastructure is set up to support CORS.

## What this folder includes

### Infrastructure

- A Terraform file for provisioning API Gateway and Lambda resources, including required IAM permissions.

### Application

- A Zip file that includes the Node.js files required for the application run on the Lambda function
- A client-side script written in html to be stored in S3 (or can be ran from local machine) to create the UI in the Browser for the user to interact with.

## Important notes for running this application

On Line 35 of the `index.html` file a variable for the API Gateway endpoint base URL is declared. This should be updated to the new API Gateway endpoint that is created via Terraform.
