import { Injectable, OnModuleInit } from "@nestjs/common";
import { SetFileToQueuedUseCase } from "../../application/use-cases/set-file-to-queued/set-file-to-queued.use-case";

@Injectable()
export class FileSchedulerWorker implements OnModuleInit {
  constructor(
    private readonly setFileToQueued: SetFileToQueuedUseCase,
  ) { }

  onModuleInit() {
    this.start()
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