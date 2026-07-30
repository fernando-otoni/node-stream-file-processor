import { Notification } from "./notification";

export interface ValidatorFields {
  validate(notification: Notification, data: any, fields: string[]): boolean
}