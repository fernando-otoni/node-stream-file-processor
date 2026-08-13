import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import ClaimAndSetFileJobToProcessingUseCase from "../../application/use-cases/file-job/claim-and-set-file-job-to-processing/claim-and-set-file-job-to-processing.use-case";
import { FileJobStatusEnum } from "../../domain/enums/file-job-status.enum";
import { ProcessFileJobUseCase } from "../../application/use-cases/file-job/process-file-job/process-file-job.use-case";

@Injectable()
export class FileJobProcessorWorker implements OnModuleInit {
  constructor(
    private readonly claimAndSetJobToProcessing: ClaimAndSetFileJobToProcessingUseCase,
    private readonly processFileJobUseCase: ProcessFileJobUseCase
  ) {}

  onModuleInit() {
    this.start()
    Logger.log({
      method: `${this.constructor.name}.start()`
    })
  }

  private async start() {
    while (true) {
      try {
        const ouput = await this.claimAndSetJobToProcessing.call({
          status: FileJobStatusEnum.PENDING
        })
    
        await this.processFileJobUseCase.call(ouput)
      } catch (error) {
        await this.sleep(1000)
      }
    }
  }

  async sleep(ms: number) {
    await new Promise(resolve => setTimeout(resolve, ms))
  }
}