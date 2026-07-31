import { AggregateRoot } from "src/core/shared/domain/aggregate-root";
import { FileStatusEnum } from "../enums/file-status.enum";
import { UploadedFile } from "src/core/shared/domain/models/uploaded-file";
import { FileEntity } from "../entities/file.entity";
import { UploadedFileValidatorFactory } from "../validators/file.validator";

interface FileConstructorProps {
  id?: number | null
  field_name: string
  original_name: string
  encoding: string
  mimetype: string
  path: string
  destination: string
  file_name: string
  size: number
  hash?: string
  status?: FileStatusEnum
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | null
}

export class File extends AggregateRoot {
  id?: number | null
  field_name: string
  original_name: string
  encoding: string
  mimetype: string
  path: string
  destination: string
  file_name: string
  size: number
  hash: string | null
  status: FileStatusEnum
  created_at: Date
  updated_at: Date
  deleted_at: Date | null

  constructor(props: FileConstructorProps) {
    super()
    this.id = props.id ?? null
    this.field_name = props.field_name
    this.original_name = props.original_name
    this.encoding = props.encoding
    this.mimetype = props.mimetype
    this.destination = props.destination
    this.file_name = props.file_name
    this.path = props.path
    this.size = props.size
    this.hash = props.hash ?? null
    this.status = props.status ?? FileStatusEnum.PENDING
    this.created_at = props.created_at ?? new Date()
    this.updated_at = props.updated_at ?? new Date()
    this.deleted_at = props.deleted_at ?? null
  }

  static createFromUploadedFile(uploadedFile: UploadedFile): File {
    const file = new File(uploadedFile)

    file.validate(['create'])

    return file
  }

  private validate(fields: string[]) {
    const validator = UploadedFileValidatorFactory.create()

    return validator.validate(this.notification, this, fields)
  }

  hasErrors(): boolean {
    return this.notification.hasErrors()
  }

  toJSON() {
    return {
      field_name: this.field_name,
      original_name: this.original_name,
      encoding: this.encoding,
      mimetype: this.mimetype,
      destination: this.destination,
      filename: this.file_name,
      path: this.path,
      size: this.size,
    }
  }
}