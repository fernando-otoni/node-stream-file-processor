import { IsDefined, IsInt, IsNotEmpty, IsString, MaxLength, Min } from "class-validator"
import CsvHeader from "../aggregate/csv-header.aggregate"
import { ClassValidatorFields } from "src/core/shared/domain/validators/class-validator-fields"
import { Notification } from "src/core/shared/domain/validators/notification"

class CsvHeaderFields {
  @IsDefined({ groups: ['create'] })
  @IsString({ groups: ['create'] })
  @IsNotEmpty({ groups: ['create'] })
  @MaxLength(255, { groups: ['create'] })
  name: string

  @IsInt({ groups: ['create'] })
  @Min(0, { groups: ['create'] })
  index: number

  @IsDefined({ groups: ['create'] })
  @IsInt({ groups: ['create'] })
  @Min(0, { groups: ['create'] })
  file_id: number

  constructor(aggregate: CsvHeader) {
    Object.assign(this, aggregate)
  }
}

export class CsvHeaderValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields: string[]): boolean {
    const newFields = fields?.length ? fields : ['name']

    return super.validate(notification, new CsvHeaderFields(data), newFields)
  }
}

export class CsvHeaderValidatorFactory {
  static create() {
    return new CsvHeaderValidator()
  }
}