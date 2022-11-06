import { Space} from './models/space'
export class MissingFieldError extends Error {

}
export function validateAsSpaceEntry(args:any){
    if (!(args as Space).name){
        throw new MissingFieldError('Value for name required')
    }
    if (!(args as Space).location){
        throw new MissingFieldError('Value for location required')
    }
    if (!(args as Space).spaceId){
        throw new MissingFieldError('Value for spaceId required')
    }
}