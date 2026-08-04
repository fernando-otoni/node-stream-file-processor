import { Entity } from "../entity/entity";
import { DomainError } from "../interfaces/domain-error.interface";

export class EntityConflictError extends DomainError {
  constructor(
    entity: new (...args: any[]) => Entity,
    id?: number
  ) {
    const message = id
    ? `${entity.name} already exists (id: ${id}).`
    : `${entity.name} already exists.`;

    super(message, 409)
    this.name = 'EntityConflictError'

    Object.setPrototypeOf(this, new.target.prototype)
  }
}