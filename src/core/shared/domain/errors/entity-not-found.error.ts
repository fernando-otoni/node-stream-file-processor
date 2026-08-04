import { Entity } from "../entity/entity";
import { DomainError } from "../interfaces/domain-error.interface";

export class EntityNotFoundError extends DomainError {
  constructor(
    entity: new (...args: any[]) => Entity,
    ids?: number | number[],
    details?: Record<string, unknown>
  ) {
    const idExist = ids !== undefined

    const idMessage = idExist 
      ? Array.isArray(ids) ? ids.join(", ") : ids
      : undefined

    const message = idMessage 
      ? `${entity.name} not found using ID ${idMessage}`
      : `${entity.name} not found`

    super(message, 400, details)
    this.name = 'EntityNotFoundError'

    Object.setPrototypeOf(this, new.target.prototype)
  }
}