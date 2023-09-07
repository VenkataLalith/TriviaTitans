import AWS from 'aws-sdk';
import axios from 'axios';

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const dynamodb = new AWS.DynamoDB();
const sqs = new AWS.SQS();


export const handler = async (event) => {
  console.log("Event :"+JSON.stringify(event))
const inviteId  = event.queryStringParameters.inviteId;
console.log('Invite ID :'+inviteId)
const params = {
      TableName: 'Invitations', // Replace with your actual DynamoDB table name
      Key: {
        inviteId: inviteId,
      },
    };

    const { Item } = await dynamoDB.get(params).promise();

    if (!Item) {
      return {
        statusCode: 404,
        body: 'Invite not found.',
      };
    }
    console.log('Item : '+Item)
    // Extract the fromEmailId and toEmailId from the DynamoDB document
    const fromEmailId = Item.fromEmailID;
    const toEmailId = Item.toEmailId;
    console.log("From EmailId :"+fromEmailId);
    console.log('To Email Id :'+toEmailId);
    // Pass the invite details as the body to the second Lambda function
    const secondLambdaPayload = {
      fromEmailId: fromEmailId,
      toEmailId: toEmailId,
    };

try {
    const secondLambdaUrl = 'https://lk6s1p6pz9.execute-api.us-east-1.amazonaws.com/default/addUserToTeam'; // Replace with your actual API Gateway URL

    const response = await axios.post(secondLambdaUrl, secondLambdaPayload);
    const responseBody = response.data;

    console.log('Response from second Lambda function:', responseBody);
    const messageToQueue = `Invite Id : ${inviteId} : ${toEmailId} Accepted your request to join your time and now is part of you team!`
    await pushMessageToSQS(messageToQueue)
    await deleteDocument(inviteId)



    return {
      statusCode: 200,
      body: 'Team invitation accepted successfully.',
    };
  } catch (error) {
    console.error('Error accepting team invitation:', error);

    return {
      statusCode: 500,
      body: 'Error accepting team invitation.',
    };
  }
};

const deleteDocument = async ( key) => {
  const params = {
    TableName: 'Invitations',
    Key: {
      'inviteId': { S: key } // Use the correct DynamoDB data type for the primary key attribute
    }
  };

  try {
    await dynamodb.deleteItem(params).promise();
    console.log('Document deleted successfully.');
  } catch (error) {
    console.error('Error deleting document:', error);
  }
};

const pushMessageToSQS = async ( messageBody) => {
  try {
    const params = {
      QueueUrl: 'https://sqs.us-east-1.amazonaws.com/621688211331/TeamJoinInfo',
      MessageBody: messageBody,
    };

    const response = await sqs.sendMessage(params).promise();
    console.log('Message sent:', response.MessageId);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

