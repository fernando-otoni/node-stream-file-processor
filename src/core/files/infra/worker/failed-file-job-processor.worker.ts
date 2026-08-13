import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import ClaimNextFailedJobUseCase from "../../application/use-cases/file-job/claim-and-set-file-job-to-processing/claim-and-set-file-job-to-processing.use-case";
import { FileJobStatusEnum } from "../../domain/enums/file-job-status.enum";
import { ProcessFileJobUseCase } from "../../application/use-cases/file-job/process-file-job/process-file-job.use-case";
import { LoggerProvider } from "src/core/shared/application/logger.interface";

@Injectable()
export class FailedFileJobProcessor implements OnModuleInit {
  constructor(
    private readonly claimNextFailedJob: ClaimNextFailedJobUseCase,
    private readonly processFileJobUseCase: ProcessFileJobUseCase,
    private readonly logger: LoggerProvider
  ) {}

  onModuleInit() {
    this.start()
    this.logger.log({
      method: `${this.constructor.name}.start()`
    })
  }

  async start() {
    this.logger.log({
      method: `${this.constructor.name}.start()`
    })

    while(true) {
      try {
        const output = await this.claimNextFailedJob.call({
          status: FileJobStatusEnum.FAILED
        })
        
        await this.processFileJobUseCase.call(output)
      } catch (error) {
        await this.sleep(1000)        
      }
    }
  }

  async sleep(ms: number) {
    await new Promise(resolve => setTimeout(resolve, ms))
  }
}