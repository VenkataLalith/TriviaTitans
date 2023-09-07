/*
*
*
Reference:
  Amazon Web Services, Inc., “Getting started in Node.js,” Amazon Web Services, Inc., 2023. [Online]. Available:https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-nodejs.html. [Accessed 19 05 2023].
*
*
*/



// Import required AWS SDK clients and commands
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

import { SNSClient } from "@aws-sdk/client-sns";
import { PublishCommand } from "@aws-sdk/client-sns";

// Create a DynamoDB client using DynamoDBClient from AWS SDK
const client1 = new DynamoDBClient({});
// Create a DynamoDB DocumentClient for simplified interactions with DynamoDB
const dynamo = DynamoDBDocumentClient.from(client1);

// Handler function that will be executed when the Lambda function is triggered
export const handler = async (event) => {
  // Define a constant variable to check if admin exists
  const adminExist = "adminExist";

  // Log the incoming event data and resource value
  console.log("data", event);
  console.log("res", event.queryStringParameters.resource);

  // Call getPlayerScore function to handle the incoming event and get player scores
  let responseBody = await getPlayerScore(event, adminExist);
  console.log("after res");

  // Prepare and return the response with player scores
  const response = {
    statusCode: 200,
    body: JSON.stringify(responseBody),
  };
  return response;
};

// Function to get player scores or check if admin exists based on the resource value
async function getPlayerScore(event, adminExist) {
  let responseBody;

  // Check the resource value to determine the action to be performed
  if (event.queryStringParameters.resource == "playerScore") {
    console.log("inside sssseweevent path");
    // Fetch player scores data from DynamoDB using ScanCommand
    const body = await dynamo.send(new ScanCommand({
      TableName: "playersScore",
    }));
    console.log("after fet data from db", body);
    console.log("responseBody", body.Items);
    responseBody = body.Items;
  } else if (event.queryStringParameters.resource == "checkAdminExist") {
    // Check if admin exists for a specific quiz
    let returnAdminCheckResponse;
    // Parse the incoming event body to get required parameters
    const inputBody = JSON.parse(event.body);
    console.log("inside checkadminexist", inputBody);
    console.log("inputBody", inputBody.teamName);
    /*
    *
    [1]Amazon Web Services, Inc., “Getting started with DynamoDB and the AWS SDKs,” Amazon Web Services, Inc., 2023. 
    [Online]. Available: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.html. 
    [Accessed 14 06 2023].
    *
    */
    // Query the DynamoDB table to check if an admin exists for the given quiz
    const adminExistValue = await dynamo.send(new ScanCommand({
      TableName: adminExist,
      FilterExpression: "#quizName = :quizNameValue",
      ExpressionAttributeNames: {
        "#quizName": "quizName"
      },
      ExpressionAttributeValues: {
        ':quizNameValue': inputBody.quizName
      }
    }));
    let checkAdminExist = adminExistValue.Items;

    // If no admin exists, create a new entry with admin status
    if (checkAdminExist.length == 0) {
      returnAdminCheckResponse = true;
      await dynamo.send(new PutCommand({
        TableName: adminExist,
        Item: {
          quizName: inputBody.quizName,
          playerEmail: inputBody.email,
          adminStatus: true
        }
      }));
    } else {
      // If admin exists, set the response accordingly
      returnAdminCheckResponse = false;
    }
    // Prepare the response body with email, quizName, and admin access status
    responseBody = {
      "email": inputBody.email,
      "quizName": inputBody.quizName,
      "adminAccess": returnAdminCheckResponse
    };
    console.log("quizName", adminExistValue);
  } else {
    // Handle the case when the resource is not recognized
    console.log("insise else");
    responseBody = "Error in fetching playerscore data";
  }
  return responseBody;
}
