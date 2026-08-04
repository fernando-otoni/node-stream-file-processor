import { AggregateRoot } from "src/core/shared/domain/aggregate-root";
import { FileJobStatusEnum } from "../enums/file-job-status.enum";
import { FileJobValidatorFactory } from "../validators/file-job.validator";

interface FileJobConstructorProps {
  id?: number | null
  file_id: number
  status?: FileJobStatusEnum
  attempts?: number
  error?: Record<string, any>
  created_at?: Date | null
  updated_at?: Date | null
  finished_at?: Date | null
  deleted_at?: Date | null
}

interface FileJobCreateCommand {
  file_id: number
  status?: FileJobStatusEnum
}

export class FileJob extends AggregateRoot {
  id: number | null
  file_id: number
  status: FileJobStatusEnum
  attempts: number
  error?: Record<string, any>
  created_at: Date
  updated_at: Date
  finished_at: Date | null
  deleted_at: Date | null

  constructor(props: FileJobConstructorProps) {
    super()
    this.id = props.id ?? null
    this.file_id = props.file_id
    this.attempts = props.attempts ?? 0
    this.status = props.status ?? FileJobStatusEnum.PENDING
    this.created_at = props.created_at ?? new Date()
    this.updated_at = props.updated_at ?? new Date()
    this.finished_at = props.finished_at ?? null
    this.deleted_at = props.finished_at ?? null
  }

  static create(input: FileJobCreateCommand): FileJob {
    const fileJob = new FileJob(input)

    fileJob.validate(['create'])

    return fileJob
  }

  private validate(fields: string[]) {
    const validator = FileJobValidatorFactory.create()

    validator.validate(this.notification, this, fields)
  }
  
  hasErrors(): boolean {
    return this.notification.hasErrors()
  }

  setId(id: number) {
    this.id = id
  }

  toJSON() {
    return {}
  }
}