/*
*
*
Reference:
  Amazon Web Services, Inc., “Getting started in Node.js,” Amazon Web Services, Inc., 2023. [Online]. Available:https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-nodejs.html. [Accessed 19 05 2023].
*
*
*/

// Import required AWS SDK components
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";

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
const tableName = process.env.Question_Data;
const playerOnlineTable = process.env.Player_Online_Table;

export const handler = async (event) => {
  let gamePlayedTimes = 0;

  // Parse the SNS message from the event
  const jsonString = event['Records'][0]['Sns']['Message'];
  const dataFromGetSendDataRequestFromClient = JSON.parse(jsonString);
  const callbackUrl = dataFromGetSendDataRequestFromClient.callbackUrl;
  const client = new ApiGatewayManagementApiClient({ endpoint: callbackUrl });

  let body;

  // Fetch data from the Player_Online_Table
  const fetchDataFromPlayerConnected = await dynamo.send(
    new ScanCommand({ TableName: playerOnlineTable })
  );
  const playerEmailArray = fetchDataFromPlayerConnected.Items.map((item) => item.playerEmail);

  // Fetch data from the Question_Data table
  body = await dynamo.send(new ScanCommand({ TableName: tableName }));
  let itemCount = body.Count;
  body = body.Items;
  let quizTime = body[0].quizTime;

  const playersOnlinelist = fetchDataFromPlayerConnected.Items;
/*
*
[1]Amazon Web Services, Inc., “Getting started with DynamoDB and the AWS SDKs,” Amazon Web Services, Inc., 2023. 
[Online]. Available: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.html. 
[Accessed 12 05 2023].
*
*/
  // Fetch player scores for the specific team and quiz
  const scoreListBody = await dynamo.send(new ScanCommand({
    TableName: playerScoreTable,
    FilterExpression: "#teamName = :teamName AND #quizName = :quizName",
    ExpressionAttributeNames: {
      "#teamName": "teamName",
      "#quizName": "quizName",
    },
    ExpressionAttributeValues: {
      ':teamName': dataFromGetSendDataRequestFromClient.teamName,
      ':quizName': dataFromGetSendDataRequestFromClient.quizName,
    }
  }));

  // Find the highest gamePlayedTimes among the existing scores
  try {
    scoreListBody.Items.forEach((item) => {
      if (item.gamePlayedTimes > gamePlayedTimes) {
        gamePlayedTimes = item.gamePlayedTimes;
      }
    });
    gamePlayedTimes++;
  } catch (err) {
    // Handle error in case of no scores found
    console.error("error in score getting the data", err);
  }

  // Function to send each question to connected clients
  function sendEveryQuestion(ms, body, client) {
    return new Promise(async resolve => {
      let i = 0;
      for (const value of body) {
        i++;
        await timeout(ms, value, client, playersOnlinelist, dataFromGetSendDataRequestFromClient, gamePlayedTimes, playerEmailArray);
        if (i >= itemCount) {
          const value = { "question": "Quiz Ended", "number": 0, "quizNumber": "", "option4": "", "option3": "", "option2": "", "option1": "", "quizTime": "", "answer": "" };
          await timeout(ms, value, client, playersOnlinelist, dataFromGetSendDataRequestFromClient, gamePlayedTimes, playerEmailArray);
          resolve();
        }
      }
    });
  }

  // Send each question with a specified delay
  await sendEveryQuestion(10000, body, client);

  return {
    statusCode: 200,
  };
};

// Function to introduce a delay before sending data to clients
function timeout(ms, value, client, playersOnlinelist, dataFromGetSendDataRequestFromClient, gamePlayedTimes, playerEmailArray) {
  return new Promise(resolve => {
    setTimeout(async () => {
      let playerScoreJson = [];
/*
*
[1]Amazon Web Services, Inc., “Getting started with DynamoDB and the AWS SDKs,” Amazon Web Services, Inc., 2023. 
[Online]. Available: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.html. 
[Accessed 12 05 2023].
*
*/
      // Fetch player scores for the specific team, quiz, and gamePlayedTimes
      try {
        const scoreListBody = await dynamo.send(new ScanCommand({
          TableName: playerScoreTable,
          FilterExpression: "#teamName = :teamName AND #quizName = :quizName AND #gamePlayedTimes = :gamePlayedTimes",
          ExpressionAttributeNames: {
            "#teamName": "teamName",
            "#quizName": "quizName",
            "#gamePlayedTimes": "gamePlayedTimes"
          },
          ExpressionAttributeValues: {
            ':teamName': dataFromGetSendDataRequestFromClient.teamName,
            ':quizName': dataFromGetSendDataRequestFromClient.quizName,
            ':gamePlayedTimes': gamePlayedTimes,
          }
        }));

        // Prepare player score data to be sent to clients
        scoreListBody.Items.forEach((item) => {
          let scoreDetials = [item.playerID, item.score];
          playerScoreJson = [...playerScoreJson, scoreDetials];
        });
      } catch (err) {
        // Handle error in case of no scores found
        playerScoreJson = ["Nobody in your team scored yet"];
      }

      // Send the data to each connected client
      for (const playerConnectedId of playersOnlinelist) {
        const value1 = [value, { "connectionId": playerConnectedId.connectionId, "gamePlayedTimes": gamePlayedTimes, "playerScoreList": playerScoreJson, "playersOnline": playerEmailArray }];
        const requestParams = {
          ConnectionId: playerConnectedId.connectionId,
          Data: JSON.stringify(value1),
        };
        await senddataafter(requestParams, client);
      }

      resolve();
    }, ms);
  });
}

// Function to send data to the connected clients
async function senddataafter(requestParams, client) {
  const command = new PostToConnectionCommand(requestParams);

  try {
    await client.send(command);
  } catch (error) {
    // Handle error if the client connection is no longer valid
    console.error(error);
  }
}
