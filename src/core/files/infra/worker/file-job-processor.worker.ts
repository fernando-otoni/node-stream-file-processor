import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ProcessFileJobUseCase } from "../../application/use-cases/process-file-job/process-file-job.use-case";

@Injectable()
export class FileJobProcessorWorker implements OnModuleInit {
  constructor(
    private readonly processFileJobUseCase: ProcessFileJobUseCase
  ) {}

  onModuleInit() {
    Logger.log({
      method: `${this.constructor.name}.start()`
    })
    this.start()
  }

  private async start() {
    while(true) {
      await this.processFileJobUseCase.call()
        .catch(async () => await this.sleep(1500))
    }
  }

  async sleep(ms: number) {
    await new Promise(resolve => setTimeout(resolve, ms))
  }
}