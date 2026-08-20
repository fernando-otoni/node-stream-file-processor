import { Injectable, OnModuleInit } from "@nestjs/common";
import { SetFileToQueuedUseCase } from "../../application/use-cases/file/set-file-to-queued/set-file-to-queued.use-case";
import { LoggerProvider } from "src/core/shared/application/logger.interface";

@Injectable()
export class FileSchedulerWorker implements OnModuleInit {
  constructor(
    private readonly setFileToQueued: SetFileToQueuedUseCase,
    private readonly logger: LoggerProvider
  ) { }

  onModuleInit() {
    this.start()
    
    this.logger.log({
      method: `${this.constructor.name}.start()`
    })
  }

  private async start() {
    const workers = Array.from(
      { length: 5 },
      () => this.processLoop()
    )
   
    await Promise.all(workers)
  }

  private async processLoop() {
    while (true) {
      await this.setFileToQueued.call()
        .catch(async (e) => {
          await this.sleep(1000)
        })
      }
  }

  async sleep(ms: number) {
    await new Promise(resolve => setTimeout(resolve, ms))
  }
}