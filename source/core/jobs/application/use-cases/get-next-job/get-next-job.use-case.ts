import { Job } from "source/core/jobs/domain/aggregates/job.aggregate";
import { JobStatusEnum } from "source/core/jobs/domain/enums/job-status.enum";
import { UseCase } from "source/core/shared/application/use-case.interface";

export class GetNextJobInput implements UseCase<GetNextJobInput, Job> {
  constructor() {}

  async call(input: GetNextJobInput) {
    return new Job({
      payload: {} as any,
      status: JobStatusEnum.PENDING,
      type: 'FILE'
    })
  }
}