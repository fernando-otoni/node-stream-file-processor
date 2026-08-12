import { AggregateRoot } from "src/core/shared/domain/aggregate-root";
import { FileJobStatusEnum } from "../enums/file-job-status.enum";
import { FileJobValidatorFactory } from "../validators/file-job.validator";
import { FileJobEntity } from "../entities/file-job.entity";

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

  static createFromEntity(fileJob: FileJobEntity): FileJob {
    const aggregate = new FileJob(fileJob)

    aggregate.validate(['create'])

    return aggregate
  }

  toProcessing() {
    if(this.status !== FileJobStatusEnum.PENDING) {
      this.notification.addError({
        field: 'status',
        error: `File Job cannot be processed due to current status ${this.status}`
      })

      return
    }

    this.status = FileJobStatusEnum.PROCESSING
  }

  toDone() {
    if(this.status !== FileJobStatusEnum.PROCESSING) {
      this.notification.addError({
        field: 'status',
        error: `File Job cannot be set to Done due to current status ${this.status}`
      })

      return
    }

    this.finished_at = new Date()
    this.status = FileJobStatusEnum.DONE
  }

  toFailed() {
    this.status = FileJobStatusEnum.FAILED
  }

  incrementAttemps() {
    this.attempts += 1
  }

  setErrors(errors?: Record<string, any>[]) {
    const notificationErrors = this.notification.toJSON()
    console.log(errors)

    this.error = [
      ...notificationErrors, 
      ...(errors?.length ? [...errors] : [])
    ]
  }

  hasErrors(): boolean {
    return this.notification.hasErrors()
  }

  setId(id: number) {
    this.id = id
  }

  private validate(fields: string[]) {
    const validator = FileJobValidatorFactory.create()

    validator.validate(this.notification, this, fields)
  }

  toJSON() {
    return {}
  }

  toEntity(): FileJobEntity {
    return {
      id: this.id,
      file_id: this.file_id,
      status: this.status,
      attempts: this.attempts,
      error: this.error,
      file: undefined,
      created_at: this.created_at,
      updated_at: this.updated_at,
      finished_at: this.finished_at,
      deleted_at: this.deleted_at,
    }
  }
}