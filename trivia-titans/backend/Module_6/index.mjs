import axios from 'axios';
export const handler = async (event, context) => {
  try {
    // Replace 'apiUrl' with the actual API endpoint URL
    const response = await axios.get('https://x29wkks4p9.execute-api.us-east-1.amazonaws.com/prod/reponsetoendpoint?resource=playerScore');
    const data = response.data;
    
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error calling API:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
