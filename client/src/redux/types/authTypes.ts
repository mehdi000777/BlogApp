import { IUser } from "../../utils/Typescript"

export const authTypes = {
    AUTH: "AUTH"
}

export interface IAuth {
    user?: IUser,
    token?: string
}

export interface IAuthType {
    type: typeof authTypes.AUTH
    payload: IAuth
}