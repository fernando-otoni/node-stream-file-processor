import { Job } from "source/core/jobs/domain/aggregates/job.aggregate";
import { UseCase } from "source/core/shared/application/use-case.interface";
import { GetNextPendingJobInput } from "./get-next-pending-job.input";
import { JobRepository } from "source/core/jobs/domain/repositories/job.repository";

export class GetNextPendingJob implements UseCase<GetNextPendingJobInput, Job> {
  constructor(
    private readonly jobRepository: JobRepository
  ) {}

  async call({}: GetNextPendingJobInput) {
    return new Job()
  }
}

