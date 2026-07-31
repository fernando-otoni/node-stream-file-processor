import { AggregateRoot } from "src/core/shared/domain/aggregate-root";
import { JobPayload } from "../types/job-payload.type";
import { JobStatusEnum } from "../enums/job-status.enum";

interface JobConstructorProps {
  id?: number | undefined
  type: string
  payload: JobPayload
  status?: JobStatusEnum
  attempts?: number
  error?: Record<string, any>
  created_at?: Date | undefined
  updated_at?: Date | undefined
  finished_at?: Date | undefined
}

export class Job extends AggregateRoot {
  id: number | undefined
  type: string
  payload: JobPayload
  status: JobStatusEnum
  attempts: number
  error?: Record<string, any>
  created_at: Date | undefined
  updated_at: Date | undefined
  finished_at: Date | undefined

  constructor(props: JobConstructorProps) {
    super()
    this.id = props.id
    this.type = props.type
    this.payload = props.payload
    this.attempts = props.attempts ?? 0
    this.status = props.status ?? JobStatusEnum.PENDING
    this.created_at = props.created_at 
    this.updated_at = props.updated_at
    this.finished_at = props.finished_at
  }

  toJSON() {
    return {}
  }
}