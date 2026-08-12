import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { FileJobRepository } from "../../domain/repositories/file-job.repository";
import { ReprocessFailedFileJobUseCase } from "../../application/use-cases/reprocess-failed-file-job/reprocess-failed-file-job.use-case";

@Injectable()
export class FailedFileJobProcessor implements OnModuleInit {
  constructor(private readonly reprocessFileJob: ReprocessFailedFileJobUseCase) {}

  onModuleInit() {
    this.start()
  }

  async start() {
    Logger.log({
      method: `${this.constructor.name}.start()`
    })

    // await this.reprocessFileJob.call()
  }
}