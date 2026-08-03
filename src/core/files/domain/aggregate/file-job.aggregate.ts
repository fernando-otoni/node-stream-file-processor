import { AggregateRoot } from "src/core/shared/domain/aggregate-root";
import { FileJobStatusEnum } from "../enums/file-job-status.enum";

interface FileJobConstructorProps {
  id?: number | undefined
  type: string
  status?: FileJobStatusEnum
  attempts?: number
  error?: Record<string, any>
  created_at?: Date | undefined
  updated_at?: Date | undefined
  finished_at?: Date | undefined
}

export class FileJob extends AggregateRoot {
  id: number | undefined
  type: string
  status: FileJobStatusEnum
  attempts: number
  error?: Record<string, any>
  created_at: Date | undefined
  updated_at: Date | undefined
  finished_at: Date | undefined

  constructor(props: FileJobConstructorProps) {
    super()
    this.id = props.id
    this.type = props.type
    this.attempts = props.attempts ?? 0
    this.status = props.status ?? FileJobStatusEnum.PENDING
    this.created_at = props.created_at 
    this.updated_at = props.updated_at
    this.finished_at = props.finished_at
  }

  toJSON() {
    return {}
  }
}