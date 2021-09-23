import { IAlert } from "../../utils/Typescript";
import { alertTypes, IAlertType } from "../types/alertTypes";


export const alertReducer = (state: IAlert = {}, action: IAlertType): IAlert => {
    switch (action.type) {
        case alertTypes.ALERT:
            return action.payload
        default:
            return state
    }
}