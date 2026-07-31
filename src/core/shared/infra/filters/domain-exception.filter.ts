import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { DomainError } from "../../domain/interfaces/domain-error.interface";
import { EntityValidationError } from "../../domain/errors/entity-validation.error";

@Catch(DomainError)
export class DomainExpectionFilter implements ExceptionFilter<DomainError> {
  catch(exception: DomainError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse()
    
    response.status(exception.statusCode).json({
      message: exception.message,
      ...(exception instanceof EntityValidationError && {
        errors: exception.errors,
      }),
    })
  }
}