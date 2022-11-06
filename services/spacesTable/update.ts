import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { TABLE_NAME, PRIMARY_KEY, dbClient} from '../common';

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'hello from lambda'
    }
    const requestBody =  typeof event.body == 'object' ? event.body : JSON.parse(event.body);
    const spaceId = event.queryStringParameters?.[PRIMARY_KEY!];
    if( requestBody && spaceId){
        const requestBodyKey = Object.keys(requestBody)[0];
        const requestBodyValue = requestBody[requestBodyKey];

        const updateResult = await dbClient.update({
            TableName: TABLE_NAME!,
            Key:{
                [PRIMARY_KEY!]: spaceId 
            },
            UpdateExpression: 'set #zz = :zzzz',
            ExpressionAttributeNames:{
                '#zz': requestBodyKey
            },
            ExpressionAttributeValues:{
                ':zzzz': requestBodyValue
            },
            ReturnValues: 'UPDATED_NEW'
        }).promise();
        result.body = JSON.stringify(updateResult);
    }
    return result;
} 

export { handler}