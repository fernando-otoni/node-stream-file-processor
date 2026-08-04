import { IsDefined, IsEnum, IsInt, IsNotEmpty, IsString } from "class-validator";
import { FileJobStatusEnum } from "../enums/file-job-status.enum";
import { FileJob } from "../aggregate/file-job.aggregate";
import { ClassValidatorFields } from "src/core/shared/domain/validators/class-validator-fields";
import { Notification } from "src/core/shared/domain/validators/notification";

class FileJobFields {
  @IsDefined({ groups: ['create'] })
  @IsInt({ groups: ['create'] })
  file_id: number

  @IsDefined({ groups: ['create'] })
  @IsString({ groups: ['create'] })
  @IsNotEmpty({ groups: ['create'] })
  @IsEnum(FileJobStatusEnum, {
    groups: ['create'],
    message: 'Status must be a valid FileJogStatusEnum'
  })
  status: FileJobStatusEnum

  constructor(aggregate: FileJob) {
    Object.assign(this, aggregate)
  }
}

export class FileJobValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields: string[]): boolean {
    const group = fields?.length ? fields : ['create']

    return super.validate(notification, new FileJobFields(data), group)
  }
}

export class FileJobValidatorFactory {
  static create() {
    return new FileJobValidator()
  }
}