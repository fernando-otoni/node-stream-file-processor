import { IsDefined, IsInt, IsString, MaxLength, Min, ValidateIf } from "class-validator"
import { ClassValidatorFields } from "src/core/shared/domain/validators/class-validator-fields"
import { Notification } from "src/core/shared/domain/validators/notification"
import CsvRow from "../aggregate/xlsx-row.aggregate"

class XlsxRowFields {
  @IsString()
  @MaxLength(255)
  @ValidateIf((_, value) => typeof value === 'string')
  data: (string | number)[]

  @IsDefined({ groups: ['create'] })
  @IsInt({ groups: ['create'] })
  @Min(0, { groups: ['create'] })
  file_id: number

  @IsDefined({ groups: ['create'] })
  @IsInt({ groups: ['create'] })
  @Min(0, { groups: ['create'] })
  worksheet_index: number

  @IsInt({ groups: ['create'] })
  @Min(0, { groups: ['create'] })
  row: number

  constructor(aggregate: CsvRow) {
    Object.assign(this, aggregate)
  }
}

export class XlsxRowValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields: string[]): boolean {
    const newFields = fields?.length ? fields : ['name']

    return super.validate(notification, new XlsxRowFields(data), newFields)
  }
}

export class XlsxRowValidatorFactory {
  static create() {
    return new XlsxRowValidator()
  }
}