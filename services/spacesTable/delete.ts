import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { TABLE_NAME, PRIMARY_KEY, dbClient } from '../common';

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'this is a success'
    }
    const spaceId = event.queryStringParameters?.[PRIMARY_KEY!];
    if (spaceId) {
        const deleteResult = await dbClient.delete({
            TableName: TABLE_NAME!,
            Key: {
                [PRIMARY_KEY!]: spaceId
            }
        }).promise();
        result.body = JSON.stringify(deleteResult);
    }
    return result;
}
export { handler }