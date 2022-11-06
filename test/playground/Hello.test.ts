import { APIGatewayProxyEvent } from "aws-lambda";
import {  handler } from "../../services/spacesTable/create";
const event : APIGatewayProxyEvent = {
    body:{
        name: 'Melano'
    }
} as any;


const result = handler(event ,{} as any).then(res=>{
    const items = JSON.parse(res.body)
    console.log(123)
})