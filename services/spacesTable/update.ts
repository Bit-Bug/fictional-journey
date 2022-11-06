import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { TABLE_NAME, PRIMARY_KEY, dbClient } from '../common';
import { getEventBody } from '../shared/utils';

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'hello from lambda'
    }
    const requestBody = getEventBody(event);
    const spaceId = event.queryStringParameters?.[PRIMARY_KEY!];
    try {
        if (requestBody && spaceId) {
            const requestBodyKey = Object.keys(requestBody)[0];
            const requestBodyValue = requestBody[requestBodyKey];

            const updateResult = await dbClient.update({
                TableName: TABLE_NAME!,
                Key: {
                    [PRIMARY_KEY!]: spaceId
                },
                UpdateExpression: 'set #zz = :zzzz',
                ExpressionAttributeNames: {
                    '#zz': requestBodyKey
                },
                ExpressionAttributeValues: {
                    ':zzzz': requestBodyValue
                },
                ReturnValues: 'UPDATED_NEW'
            }).promise();
            result.body = JSON.stringify(updateResult);
        }
    } catch (error: any) {
        result.body = error.message;
    }
    return result;
}

export { handler }