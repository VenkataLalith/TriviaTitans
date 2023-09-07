import AWS from 'aws-sdk'

const dynamo = new AWS.DynamoDB.DocumentClient();
const dynamoDB = new AWS.DynamoDB();
/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 *
 * To scan a DynamoDB table, make a GET request with the TableName as a
 * query string parameter. To put, update, or delete an item, make a POST,
 * PUT, or DELETE request respectively, passing in the payload to the
 * DynamoDB API as a JSON body.
 */
export const handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };
    
    const tableName = "Teams";
   
    const count = await getDocumentCountInTable(tableName);
    const teamId = count+1;
    const admin = event.user_id;
    let members = [];
    members.push(event.user_id);
    console.log("Count :"+count);

    
    const params = {
    TableName: tableName,
    Item: {
      team_id:teamId.toString(),
      admin_user_id:admin,
      team_name: event.team_name,
      team_members:members
    }
  };
     console.log('In Lambda function - POST method')
                console.log(event)
  
    
               
    try {
        if(await userBelongsToAnyOtherTeam()){
            console.log('User already belongs to a team.')
            body = "User already belongs to a team."
        }else{
            await dynamo.put(params).promise();
            const statparams = {
                TableName: 'TeamStats',
                Item: {
                    team_id:teamId.toString(),
                    games_played:0,
                    wins:0,
                    loss:0,
                    points:0
    }
            }
            try{
              await dynamo.put(statparams).promise();
               
                const message= "Team created successfully"
                body = {
                    message:message,
                    team_id:teamId,
                    teamName:event.team_name
                }
            } catch (err){
                body = err.message;
            }
        }
        
         
    } catch (err) {
        statusCode = '400';
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
    
    async function userBelongsToAnyOtherTeam(){
        console.log("Inside Function")
        const params = {
    TableName: 'Teams',
    FilterExpression: 'contains(team_members, :email)',
    ExpressionAttributeValues: {
      ':email': event.user_id
    }
  };
//   console.log("USER email Id :"+event.admin_user_id)
  const result = await dynamo.scan(params).promise();
    console.log("Result :"+result);
  if( result.Items.length > 0){
      return true;
  }
  else{
      return false;
  }
    
};

async function getDocumentCountInTable(tableName){
     const countParams = {
      TableName: tableName,
      Select: 'COUNT',
    };

    const result = await dynamoDB.scan(countParams).promise();
    return result.Count;
}

};