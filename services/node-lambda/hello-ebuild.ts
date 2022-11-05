import { v4 } from 'uuid';
async function handler (event:any, context:any){
    return {
        statusCode: 200,
        body: `This is an es lambda function ${v4()}` 
    }
}

export {handler};