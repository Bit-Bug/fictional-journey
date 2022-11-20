import { S3 } from 'aws-sdk';
import { APIGatewayProxyEvent } from "aws-lambda";

const s3Client = new S3();
async function handler (event:any, context:any){
    const buckets = await s3Client.listBuckets().promise();
    console.log('got an event');
    console.log( event );
    if (isAuthorized(event)){
        return {
            statusCode: 200,
            body: `This is an es lambda function ${JSON.stringify(buckets)}` 
        }
    }
    else{
        return {
            statusCode: 401,
            body: `Unauthorized` 
        }
    }
}

function isAuthorized(event: APIGatewayProxyEvent){
    const groups = event.requestContext.authorizer?.claims['cognito:groups'];
    return !!groups ? (groups as string).includes('admins') : false;
}
export { handler };