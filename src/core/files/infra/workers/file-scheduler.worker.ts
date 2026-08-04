import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { GetNextPendingFile } from "../../application/use-cases/get-next-pending-file/get-next-pending-file.use-case";
import { SetFileToQueuedUseCase } from "../../application/use-cases/set-file-to-queued/set-file-to-queued.use-case";

@Injectable()
export class FileSchedulerWorker implements OnModuleInit {
  constructor(
    private readonly getNextPendingFile: GetNextPendingFile,
    private readonly setFileToQueued: SetFileToQueuedUseCase
  ) {}

  onModuleInit() {
    this.start()
  }

  private async start() {
    while(true) {
      const file = await this.getNextPendingFile.call()
      if(!file) {
        await this.sleep(1000)
        continue
      }

      await this.setFileToQueued.call({ file_id: file.id! })
    }
  }

  async sleep(ms: number) {
    await new Promise(resolve => setTimeout(resolve, ms))
  }
}