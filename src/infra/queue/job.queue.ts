import { Injectable, Logger } from "@nestjs/common";
import { JobRepository } from "./database/job.repository";
import { JobEntity } from "./entity/job.entity";
import { JobFileDto } from "./job-file-processor.interface";

@Injectable()
export class JobQueue {
  constructor(
    private readonly jobRepository: JobRepository
  ) { }

  toJobFileFormat(item: JobEntity): JobFileDto {
    const payload = item.payload

    return {
      jobId: item.id,
      originalName: payload.originalname,
      path: payload.path,
      mimetype: payload.mimetype,
      size: payload.size,
      attempts: item.attempts
    }
  }

  async getNextJob() {
    const job = await this.jobRepository.getNextPendingJob({ type: 'FILE' })
    if(!job) {
      return 
    }

    return this.toJobFileFormat(job)
  }

  async getNextFailedJob() {
    const job = await this.jobRepository.getNextFailedJob({ type: 'FILE' })

    if(!job) return

    return this.toJobFileFormat(job)
  }
}