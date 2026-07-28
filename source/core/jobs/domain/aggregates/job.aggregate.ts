import { AggregateRoot } from "source/core/shared/domain/aggregate-root";
import { JobPayload } from "../types/job-payload.type";
import { JobStatusEnum } from "../enums/job-status.enum";
import { JobEntity } from "../entities/job.entity";

interface JobConstructorProps {
  id: number
  type: string
  payload: JobPayload
  status: JobStatusEnum
  attempts?: number
  error?: Record<string, any>
  created_at?: Date;
  updated_at?: Date;
  finished_at?: Date;
}

export class Job extends AggregateRoot {
  id: number
  type: string
  payload: JobPayload
  status: JobStatusEnum
  attempts: number
  error?: Record<string, any>
  created_at: Date 
  updated_at: Date;
  finished_at: Date;

  constructor(props: JobConstructorProps) {
    super()
    this.id = props.id
    this.type = props.type
    this.payload = props.payload
    this.attempts = props.attempts ?? 0
    this.id = props.id
    this.id = props.id
    this.id = props.id
  }
}