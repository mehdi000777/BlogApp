import { IUser } from "../../utils/Typescript";

export const GET_USER_PROFILE = "GET_USER_PROFILE";


export interface IUserProfileType {
    type: typeof GET_USER_PROFILE
    payload: IUser
}