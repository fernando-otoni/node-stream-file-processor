import { IsDefined, IsInt, IsNotEmpty, IsString, MaxLength, Min } from "class-validator"
import { ClassValidatorFields } from "src/core/shared/domain/validators/class-validator-fields"
import { Notification } from "src/core/shared/domain/validators/notification"
import XlsxWorksheet from "../aggregate/xlsx-worksheet.aggregate"

class XlsxWorksheetFields {
  @IsDefined({ groups: ['create'] })
  @IsString({ groups: ['create'] })
  @IsNotEmpty({ groups: ['create'] })
  @MaxLength(255, { groups: ['create'] })
  name: string
 
  @IsDefined({ groups: ['create'] })
  @IsInt({ groups: ['create'] })
  @Min(0, { groups: ['create'] })
  index: number

  @IsDefined({ groups: ['create'] })
  @IsInt({ groups: ['create'] })
  @Min(0, { groups: ['create'] })
  file_id: number


  constructor(aggregate: XlsxWorksheet) {
    Object.assign(this, aggregate)
  }
}

export class XlsxWorksheetValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields: string[]): boolean {
    const newFields = fields?.length ? fields : ['name']

    return super.validate(notification, new XlsxWorksheetFields(data), newFields)
  }
}

export class XlsxWorksheetValidatorFactory {
  static create() {
    return new XlsxWorksheetValidator()
  }
}