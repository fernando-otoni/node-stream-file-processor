import { Injectable, OnModuleInit } from "@nestjs/common";
import { GetFileToProcessUseCase } from "src/core/files/application/use-cases/get-file-to-process/get-file-to-process.use-case";
import { FileJob } from "src/core/files/domain/aggregate/file-job.aggregate";

@Injectable()
export class FileProcessingWorker implements OnModuleInit {
  constructor(
    private readonly getFileToProcess: GetFileToProcessUseCase
  ) {}

  onModuleInit() {
    console.log("Iniciou...")
    this.start()
  }

  private async start() {
    const file = await this.getFileToProcess.call()

    const job = new FileJob({
      type: 'file',
    })
    console.log(job)

  }

  private startJob() {
  }
}