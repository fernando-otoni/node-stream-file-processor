import { Notification } from "../validators/notification";

export abstract class Entity {
  notification: Notification = new Notification()

  abstract toJSON(): any
}