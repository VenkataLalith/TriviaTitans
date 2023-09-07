/*
*
*
Reference:
  Amazon Web Services, Inc., “Getting started in Node.js,” Amazon Web Services, Inc., 2023. [Online]. Available:https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-nodejs.html. [Accessed 19 05 2023].
*
*
*/

// Import required AWS SDK components
import { SNSClient } from "@aws-sdk/client-sns";
import { PublishCommand } from "@aws-sdk/client-sns";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB clients
const client1 = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client1);

// Get environment variables
const playerScoreTable = process.env.Player_Score_Table;

export const handler = async (event) => {
  // Set the AWS Region.
  const REGION = "us-east-1"; // e.g. "us-east-1"

  // Create SNS service object.
  const snsClient = new SNSClient({ region: REGION });

  // Extracting data from the WebSocket API event
  const domain = event.requestContext.domainName;
  const stage = event.requestContext.stage;
  const connectionId = event.requestContext.connectionId;
  const callbackUrl = `https://${domain}/${stage}`;
  const eventBody = JSON.parse(event.body);
  const teamName = eventBody.message.teamName;
  const quizName = eventBody.message.quizName;
/*
*
[1]Amazon Web Services, Inc., “Getting started with DynamoDB and the AWS SDKs,” Amazon Web Services, Inc., 2023. 
[Online]. Available: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.html. 
[Accessed 14 06 2023].
*
*/
  // Fetch player score data based on team name and quiz name
  const scoreListBody = await dynamo.send(new ScanCommand({
    TableName: playerScoreTable,
    FilterExpression: "#teamName = :teamName AND #quizName = :quizName",
    ExpressionAttributeNames: {
      "#teamName": "teamName",
      "#quizName": "quizName",
    },
    ExpressionAttributeValues: {
      ':teamName': teamName,
      ':quizName': quizName,
    }
  }));

  const scoreList = scoreListBody.Items[0];

  // Create payload to send data to the client connected via WebSocket
  const payloadToSendDataToClient = `{"data":"quiz1","callbackUrl":"${callbackUrl}","teamName":"${teamName}","quizName":"${quizName}"}`;
  const topicArn = process.env.Sns_Topic_Arn; // Replace this with the ARN of your SNS topic

  const message = payloadToSendDataToClient;

  const params = {
    Message: message,
    TopicArn: topicArn,
  };

  try {
    // Publish the message to the SNS topic
    const data = await snsClient.send(new PublishCommand(params));
    console.log("Success.", data);
  } catch (err) {
    console.log("Error", err.stack);
  }

  // Return a success status code to the WebSocket API
  return {
    statusCode: 200,
  };
};
