import { JobPayload } from "../types/job-payload.type"
import { JobTypesEnum } from "../enums/job-types.enum"
import { JobStatusEnum } from "../enums/job-status.enum"

export interface JobEntity {
  id: number
  payload: JobPayload
  type: JobTypesEnum
  status: JobStatusEnum
  attempts: number
  error?: Record<string, any>
  created_at: Date;
  updated_at: Date;
  finished_at: Date;
  deleted_at: Date | null;
}

