import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ProcessFileJobUseCase } from "../../application/use-cases/process-file-job/process-file-job.use-case";
import { ClaimNextPendingFileUseCase } from "../../application/use-cases/claim-next-pending-file/claim-next-pending-file.use-case";

@Injectable()
export class FileJobProcessorWorker implements OnModuleInit {
  constructor(
    private readonly processFileJobUseCase: ProcessFileJobUseCase,
    private readonly claimNextPendingFile: ClaimNextPendingFileUseCase,
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
        const { file, file_job } = await this.claimNextPendingFile.call()
    
        if(!file || !file_job) {
          await this.sleep(1000)
          continue
        }
    
        await this.processFileJobUseCase.call({ file, file_job })
      } catch (error) {
        Logger.error({
          method: `${this.constructor.name}.start()`,
          error: error?.message ?? 'Unknown error'
        })      
        await this.sleep(1000)
      }
    }
  }

  async sleep(ms: number) {
    await new Promise(resolve => setTimeout(resolve, ms))
  }
}