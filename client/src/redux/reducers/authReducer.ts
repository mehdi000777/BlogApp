import { authTypes, IAuth, IAuthType } from "../types/authTypes";


export const authReducer = (state: IAuth = {}, action: IAuthType): IAuth => {
    switch (action.type) {
        case authTypes.AUTH:
            return action.payload
        default:
            return state
    }
}