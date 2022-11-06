import { APIGatewayProxyEvent } from "aws-lambda";
import {  handler } from "../../services/spacesTable/read";
const event : APIGatewayProxyEvent = {
    queryStringParameters:{
        spaceId: 'a98b64e8-5893-4dd3-990f-7dd2b7678958'
    }
} as any;


const result = handler(event ,{} as any).then(res=>{
    const items = JSON.parse(res.body)
    console.log(123)
})