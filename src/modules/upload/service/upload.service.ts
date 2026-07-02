import { Injectable, Logger } from "@nestjs/common";
import { JobQueue } from "src/infra/queue/job.queue";
import { IFile } from "../infra/controller/upload.controller";
import { EnumProcessTypes } from "src/infra/queue/job.types";
import { JobRepository } from "src/infra/queue/database/job.repository";

@Injectable()
export class UploadService {
  constructor(
    private readonly queue: JobQueue,
    private readonly jobRepository: JobRepository
  ) {}

  async processFile(file: IFile) {
    const job = await this.jobRepository.create({
      payload: file,
      type: EnumProcessTypes.FILE,
    })

    Logger.log(`Job created: ${job.id}`, 'Job')
  }
}