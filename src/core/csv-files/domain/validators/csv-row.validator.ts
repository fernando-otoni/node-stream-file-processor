import { IsArray, IsDefined, IsInt, IsNotEmpty, IsString, MaxLength, Min } from "class-validator"
import { ClassValidatorFields } from "src/core/shared/domain/validators/class-validator-fields"
import { Notification } from "src/core/shared/domain/validators/notification"
import CsvRow from "../aggregate/csv-row.aggregate"

class CsvRowFields {
  @IsDefined({ groups: ['create'] })
  @IsArray({ groups: ['create'] })
  @IsString({ each: true, groups: ['create'] })
  @MaxLength(255, { each: true, groups: ['create'] })
  data: string

  @IsDefined({ groups: ['create'] })
  @IsInt({ groups: ['create'] })
  @Min(0, { groups: ['create'] })
  file_id: number

  @IsInt({ groups: ['create'] })
  @Min(0, { groups: ['create'] })
  row: number

  constructor(aggregate: CsvRow) {
    Object.assign(this, aggregate)
  }
}

export class CsvRowValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields: string[]): boolean {
    const newFields = fields?.length ? fields : ['name']

    return super.validate(notification, new CsvRowFields(data), newFields)
  }
}

export class CsvRowValidatorFactory {
  static create() {
    return new CsvRowValidator()
  }
}