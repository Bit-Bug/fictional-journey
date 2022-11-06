import { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult, Context } from 'aws-lambda';
import { TABLE_NAME, PRIMARY_KEY, dbClient} from '../common';



async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from dynamodb'
    }

    try {
        if (event.queryStringParameters) {
            if (PRIMARY_KEY! in event.queryStringParameters) {
                result.body = await queryWithPrimaryPartition(event.queryStringParameters)
            } else {
                result.body = await queryWithSecondaryParition(event.queryStringParameters)
            }
        } else {
            result.body = await scanTable();
        }
    } catch (error: any) {
        result.body = error.message
    }
    return result;
}

async function queryWithSecondaryParition(queryParams: APIGatewayProxyEventQueryStringParameters) {
    const queryKey = Object.keys(queryParams)[0];
    const keyValue = queryParams[queryKey];
    const queryResponse = await dbClient.query({
        TableName: TABLE_NAME!,
        IndexName: queryKey,
        KeyConditionExpression: '#zz = :zzzz',
        ExpressionAttributeNames: {
            '#zz': queryKey!
        },
        ExpressionAttributeValues: {
            ":zzzz": keyValue
        }
    }).promise();
    return JSON.stringify(queryResponse);
}

async function queryWithPrimaryPartition(queryParams: APIGatewayProxyEventQueryStringParameters) {
    const keyValue = queryParams[PRIMARY_KEY!];
    const queryResponse = await dbClient.query({
        TableName: TABLE_NAME!,
        KeyConditionExpression: '#zz = :zzzz',
        ExpressionAttributeNames: {
            '#zz': PRIMARY_KEY!
        },
        ExpressionAttributeValues: {
            ":zzzz": keyValue
        }
    }).promise();
    return JSON.stringify(queryResponse);
}

async function scanTable() {
    const queryResponse = await dbClient.scan({
        TableName: TABLE_NAME!
    }).promise();
    return JSON.stringify(queryResponse)
}
export { handler };