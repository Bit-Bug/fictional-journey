import { APIGatewayProxyEvent } from "aws-lambda";
import {  handler } from "../../services/spacesTable/update";
const event : APIGatewayProxyEvent = {
    queryStringParameters:{
        spaceId: '039346bb-da53-45f0-8095-fba908d9c62a'
    },
    body:{
        location: "Tunisia2"
    }
} as any;


const result = handler(event ,{} as any).then(res=>{
    const items = JSON.parse(res.body)
    console.log(123)
})