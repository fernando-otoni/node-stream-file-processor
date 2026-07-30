import { JobTypesEnum } from "../../enums/job-types.enum"

export interface GetAllPendingJobsInput {
  type: JobTypesEnum
  page?: number
  pageSize?: number
}