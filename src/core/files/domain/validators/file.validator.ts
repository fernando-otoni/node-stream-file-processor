import { IsDefined, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { ClassValidatorFields } from "src/core/shared/domain/validators/class-validator-fields";
import { File } from "../aggregate/file.aggregate";
import { Notification } from "src/core/shared/domain/validators/notification";

class FileFields {
  @IsDefined({ groups: ['create'] })
  @IsString({ groups: ['create'] })
  @IsNotEmpty({ groups: ['create'] })
  @MaxLength(255, { groups: ['create'] })
  field_name: string

  @IsDefined({ groups: ['create'] })
  @IsString({ groups: ['create'] })
  @IsNotEmpty({ groups: ['create'] })
  @MaxLength(255, { groups: ['create'] })
  original_name: string

  @IsDefined({ groups: ['create'] })
  @IsString({ groups: ['create'] })
  @IsNotEmpty({ groups: ['create'] })
  @MaxLength(255, { groups: ['create'] })
  encoding: string

  @IsDefined({ groups: ['create'] })
  @IsString({ groups: ['create'] })
  @IsNotEmpty({ groups: ['create'] })
  @MaxLength(255, { groups: ['create'] })
  mimetype: string

  @IsDefined({ groups: ['create'] })
  @IsString({ groups: ['create'] })
  @IsNotEmpty({ groups: ['create'] })
  @MaxLength(255, { groups: ['create'] })
  destination: string

  @IsDefined({ groups: ['create'] })
  @IsString({ groups: ['create'] })
  @IsNotEmpty({ groups: ['create'] })
  @MaxLength(255, { groups: ['create'] })
  file_name: string

  @IsDefined({ groups: ['create'] })
  @IsString({ groups: ['create'] })
  @IsNotEmpty({ groups: ['create'] })
  @MaxLength(255, { groups: ['create'] })
  path: string

  @IsInt({ groups: ['create'] })
  @Min(1, { groups: ['create'] })
  size: number

  constructor(aggregate: File) {
    Object.assign(this, aggregate)
  }
}

export class UploadedFileValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields: string[]): boolean {
    const newFields = fields?.length ? fields : ['name']   

    return super.validate(notification, new FileFields(data), newFields)
  }
}

export class UploadedFileValidatorFactory {
  static create() {
    return new UploadedFileValidator()
  }
}