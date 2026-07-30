import { Job } from "src/core/jobs/domain/aggregates/job.aggregate";
import { JobStatusEnum } from "src/core/jobs/domain/enums/job-status.enum";
import { UseCase } from "src/core/shared/application/use-case.interface";

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