import { GET_USER_PROFILE, IUserProfileType } from "../types/userTypes";
import { IUser } from "../../utils/Typescript";


export const userProfileReducer = (state: IUser[] = [], action: IUserProfileType): IUser[] => {
    switch (action.type) {
        case GET_USER_PROFILE:
            return [action.payload, ...state]
        default:
            return state
    }
}