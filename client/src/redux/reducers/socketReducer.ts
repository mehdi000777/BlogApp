import { ISocketType, SOCKET } from "../types/socketTypes";


export const socketReducer = (state: any = null, action: ISocketType): any => {
    switch (action.type) {
        case SOCKET:
            return action.payload
        default:
            return state
    }
}