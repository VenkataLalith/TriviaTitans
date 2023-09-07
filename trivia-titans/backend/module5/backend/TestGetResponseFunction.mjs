/*
*
*
Reference:
  Amazon Web Services, Inc., “Getting started in Node.js,” Amazon Web Services, Inc., 2023. [Online]. Available:https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-nodejs.html. [Accessed 19 05 2023].
*
*
*/

// Import required AWS SDK components
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";
import axios from 'axios';

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB clients
const client1 = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client1);

// Get environment variables
const questionsTable = process.env.Question_Table;
const tableName = process.env.Table_Name;
const playerScoreTable = process.env.Player_Score_Table;
let answerStatus = false;

export const handler = async (event) => {
  // Extracting data from the WebSocket API event
  const domain = event.requestContext.domainName;
  const stage = event.requestContext.stage;
  const connectionId = event.requestContext.connectionId;
  let playerNewScore = 0;

  // Parsing the event body
  const parsedEventBody = JSON.parse(event.body);

  // Fetching the question data from DynamoDB based on the question number
  const body = await dynamo.send(new ScanCommand({ 
    TableName: questionsTable,
    FilterExpression: "#num = :questionNumber",
    ExpressionAttributeNames: {
      "#num": "number"
    },
    ExpressionAttributeValues: {
      ':questionNumber': parsedEventBody.questionNumber,
    }
  }));
/*
*
[1]Amazon Web Services, Inc., “Getting started with DynamoDB and the AWS SDKs,” Amazon Web Services, Inc., 2023. 
[Online]. Available: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.html. 
[Accessed 08 07 2023].
*
*/
  // Fetching player score data from DynamoDB based on playerEmail and connectionId
  const scoreListBody = await dynamo.send(new ScanCommand({ 
    TableName: playerScoreTable,
    FilterExpression: "#playerID = :playerEmail AND #connectionID = :connectionID",
    ExpressionAttributeNames: {
      "#playerID": "playerID",
      "#connectionID": "connectionID"
    },
    ExpressionAttributeValues: {
      ':playerEmail': parsedEventBody.playerEmail,
      ':connectionID': connectionId,
    }
  }));

  const scoreListItems = scoreListBody.Items;
  if (scoreListItems.length != 0) {
    const scoreList = scoreListBody.Items[0];
    playerNewScore = scoreList.score;
  }

  const answerList = body.Items[0];

  // Checking if the player's answer matches the correct answer
  if (parsedEventBody.playerAnswer == answerList.answer) {
    answerStatus = true;
    playerNewScore++;
  } else {
    answerStatus = false;
  }
/*
*
[1]Amazon Web Services, Inc., “Getting started with DynamoDB and the AWS SDKs,” Amazon Web Services, Inc., 2023. 
[Online]. Available: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.html. 
[Accessed 08 07 2023].
*
*/
  // Saving the player's new score to DynamoDB
  await dynamo.send(new PutCommand({
    TableName: playerScoreTable,
    Item: {
      gamePlayedTimes: parsedEventBody.sameGamePlayedTimes,
      connectionID: connectionId,
      playerID: parsedEventBody.playerEmail,
      score: playerNewScore,
      quizName: parsedEventBody.quizName,
      teamName: parsedEventBody.teamName,
    }
  }));

  // Get user profile details using a GET request to an external API
  let getResponse = {};
  let postData = {};
  try {
    getResponse = await makeGetRequest(process.env.Get_URL + parsedEventBody.playerEmail);
    let userProfileDetails = getResponse.data.profileDetails;

    postData = {
      "docName": parsedEventBody.playerEmail,
      "wholeData": {
        "profileDetails": {
          ...userProfileDetails
        },
        "gameHistory": {
          "gamePlayedTimes": parsedEventBody.sameGamePlayedTimes,
          "playerID": parsedEventBody.playerEmail,
          "score": playerNewScore,
          "teamName": parsedEventBody.teamName,
        }
      }
    };
  } catch (err) {
    console.log("error in getting the user game history" + err);
  }

  // Post user game history using a POST request to an external API
  try {
    const response1 = await makePostRequest(process.env.Post_URL, postData);
  } catch {
    console.log("error in setting the user game history");
  }

  // console.log("änswerstatus" + answerStatus);

  return {
    statusCode: 200,
  };
};

// Function to make a GET request using axios
async function makeGetRequest(url, postData) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to make a POST request using axios
async function makePostRequest(url, postData) {
  try {
    const response = await axios.post(url, postData);
    return response;
  } catch (error) {
    throw error;
  }
}
