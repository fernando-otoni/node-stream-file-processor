import { AggregateRoot } from "src/core/shared/domain/aggregate-root";
import { FileStatusEnum } from "../enums/file-status.enum";
import { UploadedFile } from "src/core/shared/domain/models/uploaded-file";
import { UploadedFileValidatorFactory } from "../validators/file.validator";
import { FileEntity } from "../entities/file.entity";

interface FileConstructorProps {
  id?: number | undefined
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
  deleted_at?: Date | undefined
}

export class File extends AggregateRoot {
  id?: number | undefined
  field_name: string
  original_name: string
  encoding: string
  mimetype: string
  path: string
  destination: string
  file_name: string
  size: number
  hash: string | undefined
  status: FileStatusEnum
  created_at: Date
  updated_at: Date
  deleted_at: Date | undefined

  constructor(props: FileConstructorProps) {
    super()
    this.id = props.id ?? undefined
    this.field_name = props.field_name
    this.original_name = props.original_name
    this.encoding = props.encoding
    this.mimetype = props.mimetype
    this.destination = props.destination
    this.file_name = props.file_name
    this.path = props.path
    this.size = props.size
    this.hash = props.hash ?? undefined
    this.status = props.status ?? FileStatusEnum.PENDING
    this.created_at = props.created_at ?? new Date()
    this.updated_at = props.updated_at ?? new Date()
    this.deleted_at = props.deleted_at ?? undefined
  }

  toQueued() {
    if(this.status !== FileStatusEnum.PENDING) {
      this.notification.addError({
        error: `File cannot be queued due to current status ${this.status}`,
        field: 'status'
      })

      return
    }

    this.status = FileStatusEnum.QUEUED
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

  toJSON(): FileEntity {
    return {
      id: this.id!,
      field_name: this.field_name,
      original_name: this.original_name,
      encoding: this.encoding,
      mimetype: this.mimetype,
      path: this.path,
      destination: this.destination,
      file_name: this.file_name,
      size: this.size,
      hash: this.hash,
      status: this.status,
      created_at: this.created_at,
      updated_at: this.updated_at,
      deleted_at: this.deleted_at,
    }
  }

  toEntity(): FileEntity {
    return {
      id: this.id!,
      field_name: this.field_name,
      original_name: this.original_name,
      encoding: this.encoding,
      mimetype: this.mimetype,
      path: this.path,
      destination: this.destination,
      file_name: this.file_name,
      size: this.size,
      hash: this.hash,
      status: this.status,
      created_at: this.created_at,
      updated_at: this.updated_at,
      deleted_at: this.deleted_at,
    }
  }
}