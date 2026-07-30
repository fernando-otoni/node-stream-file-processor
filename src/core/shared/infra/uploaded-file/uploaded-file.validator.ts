import { IsDefined, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { ClassValidatorFields } from "../../domain/validators/class-validator-fields";
import { Notification } from "../../domain/validators/notification";
import { UploadedFile } from "./uploaded-file.aggregate";

class UploadedFileFields {
  @IsDefined({ groups: ['create'] })
  @IsString({ groups: ['create'] })
  @IsNotEmpty({ groups: ['create'] })
  @MaxLength(255, { groups: ['create'] })
  fieldname: string

  @IsDefined({ groups: ['create'] })
  @IsString({ groups: ['create'] })
  @IsNotEmpty({ groups: ['create'] })
  @MaxLength(255, { groups: ['create'] })
  originalname: string

  @IsDefined({ groups: ['create'] })
  @IsString({ groups: ['create'] })
  @IsNotEmpty({ groups: ['create'] })
  @MaxLength(255, { groups: ['create'] })
  enconding: string

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
  filename: string

  @IsDefined({ groups: ['create'] })
  @IsString({ groups: ['create'] })
  @IsNotEmpty({ groups: ['create'] })
  @MaxLength(255, { groups: ['create'] })
  path: string

  @IsInt({ groups: ['create'] })
  @Min(1, { groups: ['create'] })
  size: number

  constructor(aggregate: UploadedFile) {
    Object.assign(this, aggregate)
  }
}

export class UploadedFileValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields: string[]): boolean {
    const newFields = fields?.length ? fields : ['name']   

    return super.validate(notification, new UploadedFileFields(data), newFields)
  }
}

export class UploadedFileValidatorFactory {
  static create() {
    return new UploadedFileValidator()
  }
}