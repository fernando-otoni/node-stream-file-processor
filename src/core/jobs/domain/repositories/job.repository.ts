import { PaginatedResult } from "src/core/shared/interfaces/paginated-result.interface";
import { JobEntity } from "../entities/job.entity";
import { GetAllPendingJobsInput } from "./contract/get-all-pending-jobs.input";
import { GetNextPendingJobInput } from "./contract/get-next-pending-job.input";
import { GetNextFailedJobInput } from "./contract/get-next-failed-job.input";

export interface JobRepository {
  create: (input: Partial<JobEntity>) => Promise<JobEntity>
  update: (data: Partial<JobEntity>, id: number) => Promise<JobEntity>
  getAllPendingJobs: (input: GetAllPendingJobsInput) => Promise<PaginatedResult<JobEntity>>
  getNextPendingJob: (input: GetNextPendingJobInput) => Promise<JobEntity | null>
  getNextFailedJob: (input: GetNextFailedJobInput) => Promise<JobEntity | null>
}