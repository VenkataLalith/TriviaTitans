import AWS from 'aws-sdk';
const sns = new AWS.SNS();

const inviteTopic = 'arn:aws:sns:us-east-1:621688211331:InviteTeam';
const joinTeam = 'arn:aws:sns:us-east-1:621688211331:joinTeam'

export const handler = async (event) => {
  try {
    const userEmail = event.email_id; // Parse the JSON data from event.body

    console.log(event);

    const inviteTopicParams = {
      Protocol: 'email',
      TopicArn: inviteTopic,
      Endpoint: userEmail,
    };

    const joinTeamParams = {
      Protocol: 'email',
      TopicArn: joinTeam,
      Endpoint: userEmail,
    };

    await sns.subscribe(inviteTopicParams).promise();
    await sns.subscribe(joinTeamParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User subscribed to SNS topic successfully' })
    };
  } catch (error) {
    console.error('Error subscribing user to SNS topic:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error subscribing user to SNS topic' })
    };
  }
};
