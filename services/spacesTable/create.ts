import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 } from 'uuid';
import { TABLE_NAME, dbClient } from '../common';
import { validateAsSpaceEntry, MissingFieldError } from "../shared/inputValidator";
import {  getEventBody } from '../shared/utils';

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from dynamodb'
    }

    try {
        const item = getEventBody(event);
        item.spaceId = v4();
        validateAsSpaceEntry(item);
        await dbClient.put({
            TableName: TABLE_NAME!,
            Item: item
        }).promise();
        result.body = JSON.stringify(`Created item with id: ${item.spaceId}`)
    } catch (error: any) {
        if (error instanceof MissingFieldError) {
            result.statusCode = 403;
        } else {
            result.statusCode = 500;
        }
        result.body = error.message
    }
    return result;
}

export { handler };