import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { SetFileToQueuedUseCase } from "../../application/use-cases/file/set-file-to-queued/set-file-to-queued.use-case";

@Injectable()
export class FileSchedulerWorker implements OnModuleInit {
  constructor(
    private readonly setFileToQueued: SetFileToQueuedUseCase,
  ) { }

  onModuleInit() {
    this.start()
    Logger.log({
      method: `${this.constructor.name}.start()`
    })
  }

  private async start() {
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