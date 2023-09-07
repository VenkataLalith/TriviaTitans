import AWS from 'aws-sdk';
const sns = new AWS.SNS();
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const topicArn = 'arn:aws:sns:us-east-1:621688211331:InviteTeam';

export const handler = async (event) => {
  try {
    const selectedUsers = event.selectedUsers; // Assuming the selected email IDs are passed as a parameter in the event
    // const acceptLink='https://nl0wiolbx0.execute-api.us-east-1.amazonaws.com/dev/acceptTeamJoiningInvitation?inviteId=12345';
    const inviteId = generateInviteId();
    const inviteParams = {
      TableName: 'Invitations', 
      Item: {
        inviteId: inviteId,
        fromEmailID: event.fromId,
        toEmailId:event.toId
      },
    };
    await dynamoDB.put(inviteParams).promise();
    console.log(`New document with inviteId ${inviteId} created successfully.`);

    const acceptLink=`https://og5poth3g566t3igm4vhpxp7aa0vkrjz.lambda-url.us-east-1.on.aws/?inviteId=${inviteId}`;
    const rejectLink='https://nl0wiolbx0.execute-api.us-east-1.amazonaws.com/dev/rejectTeamJoinInvitation?inviteId=8976';
    
    const message = 'Dhoni has requested to join the team. To join the team click following link :\n'+acceptLink+'\n If not interested click on follwoing link:\n'+rejectLink;

    const params = {
      Message: message,
      TopicArn: topicArn,
      // MessageAttributes: {
      //   email: {
      //     DataType: 'String.Array',
      //     StringValue: selectedUsers
      //   }
      // }
    };

    await sns.publish(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Game invites sent successfully' })
    };
  } catch (error) {
    console.error('Error sending game invites:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error sending game invites' })
    };
  }
  
};
const generateInviteId = () => {
  const length = 4; // 4-character inviteId
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let inviteId = '';
  for (let i = 0; i < length; i++) {
    inviteId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return inviteId;
};