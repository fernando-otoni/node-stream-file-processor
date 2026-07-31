import { Entity } from "../entity/entity";
import { DomainError } from "../interfaces/domain-error.interface";
import { ValidationFieldError } from "../interfaces/validation-field-error.interface";

export class EntityValidationError extends DomainError {
  constructor(
    entity: new (...args: any[]) => Entity,
    public errors: ValidationFieldError[],
  ) {
    super(`Error validating ${entity.name}`, 422)
    this.name = 'EntityValidationError'

    Object.setPrototypeOf(this, new.target.prototype)
  }
}