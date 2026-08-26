import { Injectable, OnModuleInit } from "@nestjs/common";
import { ExtractDataFromCsvFileUseCase } from "../../application/use-cases/extract-data-from-csv-file/extract-data-from-csv-file.use-case";
import { LoggerProvider } from "src/core/shared/application/logger.interface";
import { DomainError } from "src/core/shared/domain/interfaces/domain-error.interface";
import ClaimAndSetFileJobToProcessingUseCase from "src/core/files/application/use-cases/file-job/claim-and-set-file-job-to-processing/claim-and-set-file-job-to-processing.use-case";
import { FileJobStatusEnum } from "src/core/files/domain/enums/file-job-status.enum";
import { FileJobType } from "src/core/files/domain/enums/file-job-type.enum";
import { SystemMetricsProvider } from "src/core/shared/application/system-metrics.provider";

@Injectable()
export class ExtractCsvFileProcessorWorker implements OnModuleInit {
  constructor(
    private readonly claimAndSetFileJobToProcessing: ClaimAndSetFileJobToProcessingUseCase,
    private readonly extractDataFromCsvFile: ExtractDataFromCsvFileUseCase,
    private readonly logger: LoggerProvider,
    private readonly metricsProvider: SystemMetricsProvider
  ) { }

  onModuleInit() {
    this.start() 

    this.logger.log({
      method: `${this.constructor.name}.start()`
    })
  }

  async start() {
    const workers = Array.from(
      { length: 4 },
      (_, workerIndex) => this.processLoop(workerIndex + 1)
    )

    await Promise.all(workers)
  }

  private async processLoop(workerId: number) {
    while(true) {
      await this.processJob(workerId)
    }
  }

  private async processJob(workerId: number) {
    try {
      const start = new Date()

      const { file, file_job } = await this.claimAndSetFileJobToProcessing.call({
        status: FileJobStatusEnum.PENDING,
        type: FileJobType.EXTRACT_DATA,
        file_mimetype: ['text/csv']
      })

      this.logger.log({
        method: `${this.constructor.name}.start() - start`,
        worker_id: workerId,
        file_job_id: file_job.id,
        system_info: { ...this.metricsProvider.all_metrics }
      })

      await this.extractDataFromCsvFile.call({ file, file_job })

      const duration_ms = new Date().getTime() - start.getTime();

      this.logger.log({
        method: `${this.constructor.name}.start() - ended`,
        worker_id: workerId,
        file_job_id: file_job.id,
        duration_ms
      })
    } catch (error) {
      const errorIsUnexpected = !(error instanceof DomainError)
      
      if(errorIsUnexpected) {
        this.logger.error({
          method: `${this.constructor.name}.processLoop()`,
          error: error?.message,
          stack: error.stack
        })
      }

      await this.sleep(1000)
    }
  }

  private async sleep(ms: number) {
    await new Promise(resolve => setTimeout(resolve, ms))
  }
}