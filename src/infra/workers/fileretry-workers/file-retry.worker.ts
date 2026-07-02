import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { FileProcessor } from "src/infra/processor/file.processor";
import { JobRepository } from "src/infra/queue/database/job.repository";
import { JobEntity, JobStatusEnum } from "src/infra/queue/entity/job.entity";
import { JobFileDto } from "src/infra/queue/job-file-processor.interface";
import { JobQueue } from "src/infra/queue/job.queue";

@Injectable()
export class FileRetryWorker implements OnModuleInit {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly fileProcessor: FileProcessor,
    private readonly jobQueue: JobQueue
  ) {}

  onModuleInit() {
    this.start()
  }

  async start() {
    while(true) {
      const job = await this.jobQueue.getNextFailedJob()

      if(!job) {
        await this.sleep(1000)
        continue
      }

      await this.reprocessJob(job)
        .then(async () => await this.jobRepository.update({ status: JobStatusEnum.DONE }, job.jobId))
        .catch(async (e) => {
          await this.jobRepository.update({ 
          status: JobStatusEnum.FAILED,
          attempts: job.attempts + 1,
          finished_at: new Date(),
        }, job.jobId)})
    }
  }

  private async reprocessJob(job: JobFileDto) {
    Logger.log(job.path)

    const data: any = {}
    data.clear()
    
    // await this.fileProcessor.call(payload.path)
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}