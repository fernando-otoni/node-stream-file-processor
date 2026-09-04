import { IsDefined, IsInt, IsNotEmpty, IsString, MaxLength, Min } from "class-validator"
import { ClassValidatorFields } from "src/core/shared/domain/validators/class-validator-fields"
import { Notification } from "src/core/shared/domain/validators/notification"
import XlsxHeader from "../aggregate/xlsx-header.aggregate"

class XlsxHeaderFields {
  @IsDefined({ groups: ['create'] })
  @IsString({ groups: ['create'] })
  @IsNotEmpty({ groups: ['create'] })
  @MaxLength(255, { groups: ['create'] })
  name: string

  @IsInt({ groups: ['create'] })
  @Min(0, { groups: ['create'] })
  position_index: number

  @IsDefined({ groups: ['create'] })
  @IsInt({ groups: ['create'] })
  @Min(0, { groups: ['create'] })
  file_id: number

  @IsDefined({ groups: ['create'] })
  @IsInt({ groups: ['create'] })
  @Min(0, { groups: ['create'] })
  worksheet_index: number

  constructor(aggregate: XlsxHeader) {
    Object.assign(this, aggregate)
  }
}

export class XlsxHeaderValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields: string[]): boolean {
    const newFields = fields?.length ? fields : ['name']

    return super.validate(notification, new XlsxHeaderFields(data), newFields)
  }
}

export class XlsxHeaderValidatorFactory {
  static create() {
    return new XlsxHeaderValidator()
  }
}