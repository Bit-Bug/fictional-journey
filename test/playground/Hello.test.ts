import {  handler } from "../../services/spacesTable/create";
const event = {
    body:{
        location: 'Paris'
    }
}
handler( event as any,{} as any)