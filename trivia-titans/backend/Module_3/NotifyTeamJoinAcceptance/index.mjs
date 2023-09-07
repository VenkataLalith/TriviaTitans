import AWS from 'aws-sdk';

// Set the AWS region
AWS.config.update({ region: 'us-east-1' }); // Replace 'your_region' with your desired AWS region

// Create a new SNS instance
const sns = new AWS.SNS();
// Create a new SQS instance
const sqs = new AWS.SQS();

export const handler = async (event) => {
  try {
    console.log('Event : '+JSON.stringify(event))
    // Process each SQS message
    for (const message of event.Records) {
        console.log('Message :'+JSON.stringify(message))
      const messageBody = message.body;

      // Get the SNS topic ARN
      const topicArn = 'arn:aws:sns:us-east-1:621688211331:joinTeam'; // Replace 'your_topic_arn' with the ARN of your SNS topic

      // Publish the message to the SNS topic
      const params = {
        Message: JSON.stringify(messageBody),
        TopicArn: topicArn,
      };

      await sns.publish(params).promise();
      console.log('Message published to SNS:', JSON.stringify(messageBody));

      // Delete the message from the SQS queue
      const deleteParams = {
        QueueUrl: 'https://sqs.us-east-1.amazonaws.com/621688211331/TeamJoinInfo', // Replace 'your_queue_url' with the URL of your SQS queue
        ReceiptHandle: message.receiptHandle,
      };

      await sqs.deleteMessage(deleteParams).promise();
      console.log('Message deleted from SQS:', message.receiptHandle);
    }

    return {
      statusCode: 200,
      body: 'Messages processed successfully',
    };
  } catch (error) {
    console.error('Error processing messages:', error);
    return {
      statusCode: 500,
      body: 'Error processing messages',
    };
  }
};
