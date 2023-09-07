// import AWS from 'aws-sdk';
// const dynamodb = new AWS.DynamoDB.DocumentClient();
// const tableName = 'Teams';

// export const handler = async (event, context) => {
//     try {
//         // Get the email ID from the event payload
//         const email_id  = event.email_id;

//         // Scan the DynamoDB table to find items with the given email ID in the team_members list
//         const params = {
//             TableName: tableName,
//             FilterExpression: "contains(team_members, :email_id)",
//             ExpressionAttributeValues: {
//                 ":email_id": email_id
//             }
//         };
//         console.log('Before Scan method')
//         const response = await dynamodb.scan(params).promise();
//         console.log('After Scan :',response)
//         // Check if any matching items were found
//         if (response.Items && response.Items.length > 0) {
//             // Assuming only one item matches the given email_id in the team_members list
//             console.log('Item :'+response.Items[0])
//             const item = response.Items[0];

//             console.log("Team members :"+item.team_members)
//             // Extract the team_members list
//             const team_members = item.team_members;
//             console.log('Team Members')
//             // Convert the team_members list to a regular JavaScript array of email IDs
//             const team_members_list = team_members.map(member => member.S);
//             console.log('Team Mems :'+JSON.stringify(team_members_list))
//             // Return the team_members list as the response
//             return {
//                 statusCode: 200,
//                 body: item.team_members
//             };
//         } else {
//             return {
//                 statusCode: 404,
//                 body: 'Email ID not found in team members list'
//             };
//         }
//     } catch (error) {
//         return {
//             statusCode: 500,
//             body: `Error: ${error.message}`
//         };
//     }
// };

import AWS from 'aws-sdk';
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Teams';

export const handler = async (event, context) => {
    try {
        // Get the email ID from the event payload
        const email_id = event.email_id;

        // Scan the DynamoDB table to find items with the given email ID in the team_members list
        const params = {
            TableName: tableName,
            FilterExpression: "contains(team_members, :email_id)",
            ExpressionAttributeValues: {
                ":email_id": email_id
            }
        };

        const response = await dynamodb.scan(params).promise();

        // Check if any matching items were found
        if (response.Items && response.Items.length > 0) {
            // Assuming only one item matches the given email_id in the team_members list
            const item = response.Items[0];
            console.log('Team ID :'+item.team_id);
            console.log('Admin :'+item.admin_user_id);
            console.log('Team name :'+item.team_name);
            console.log('Team Members :'+item.team_members);
            // Extract the fields from the DynamoDB item
            const team_id = item.team_id;
            const admin_user_id = item.admin_user_id;
            const team_name = item.team_name;
            const team_members = item.team_members;

            // Return the response with all the fields
            return {
                statusCode: 200,
                body: {
                    team_id,
                    admin_user_id,
                    team_name,
                    team_members
            }
        };
        } else {
            return {
                statusCode: 404,
                body: 'Email ID not found in team members list'
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: `Error: ${error.message}`
        };
    }
};
