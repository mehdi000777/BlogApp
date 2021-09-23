import { IAlert } from "../../utils/Typescript"

export const alertTypes = {
    ALERT: "ALERT"
}

export interface IAlertType {
    type: typeof alertTypes.ALERT
    payload: IAlert
}