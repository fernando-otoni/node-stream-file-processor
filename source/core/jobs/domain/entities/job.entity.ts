import { JobStatusEnum } from "src/infra/queue/entity/job.entity"
import { JobPayload } from "../types/job-payload.type"

export interface JobEntity {
  id: number
  type: string
  payload: JobPayload
  status: JobStatusEnum
  attempts: number
  error?: Record<string, any>
  created_at: Date;
  updated_at: Date;
  finished_at: Date;
}

