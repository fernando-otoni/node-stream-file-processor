import { Injectable, OnModuleInit } from "@nestjs/common";
import ClaimAndSetFileJobToProcessingUseCase from "../../application/use-cases/file-job/claim-and-set-file-job-to-processing/claim-and-set-file-job-to-processing.use-case";
import { FileJobStatusEnum } from "../../domain/enums/file-job-status.enum";
import { ProcessFileJobUseCase } from "../../application/use-cases/file-job/process-file-job/process-file-job.use-case";
import { AppConfigProvider } from "src/modules/config/app-config.interface";
import { DomainError } from "src/core/shared/domain/interfaces/domain-error.interface";
import { LoggerProvider } from "src/core/shared/application/logger.interface";
import { SystemMetricsProvider } from "src/core/shared/application/system-metrics.provider";

@Injectable()
export class FileJobProcessorWorker implements OnModuleInit {
  constructor(
    private readonly claimAndSetJobToProcessing: ClaimAndSetFileJobToProcessingUseCase,
    private readonly processFileJobUseCase: ProcessFileJobUseCase,
    private readonly appConfig: AppConfigProvider,
    private readonly logger: LoggerProvider,
    private readonly metricsProvider: SystemMetricsProvider
  ) { }

  private concurrency: number = 0

  onModuleInit() {
    this.concurrency = this.appConfig.fileJobConcurrency

    this.start()

    this.logger.log({
      method: `${this.constructor.name}.start()`,
      concurrency: this.concurrency,
    })
  }

  private async start() {
    const workers = Array.from(
      { length: this.concurrency },
      (_, workerIndex) => this.processLoop(workerIndex + 1)
    )

    await Promise.all(workers)
  }

  private async processLoop(workerId: number) {
    while (true) {
      await this.processJob(workerId)
    }
  }

  private async processJob(workerId: number) {
    try {
      const start = new Date()

      const output = await this.claimAndSetJobToProcessing.call({
        status: FileJobStatusEnum.PENDING
      })

      this.logger.log({
        method: `${this.constructor.name}.start() - start`,
        worker_id: workerId,
        file_job_id: output.file_job.id,
        system_info: { ...this.metricsProvider.all_metrics }
      })

      await this.processFileJobUseCase.call(output)

      const duration_ms = new Date().getTime() - start.getTime();

      this.logger.log({
        method: `${this.constructor.name}.start() - ended`,
        worker_id: workerId,
        file_job_id: output.file_job.id,
        duration_ms
      })
    } catch (error) {
      const unexpected_error = !(error instanceof DomainError)

      if (unexpected_error) {
        this.logger.error({
          method: `${this.constructor.name}.start()`,
          stack: error.stack,
          message: error?.message ?? error.response?.data?.error
        })
      }

      await this.sleep(1000)
    }
  }

  async sleep(ms: number) {
    await new Promise(resolve => setTimeout(resolve, ms))
  }
}