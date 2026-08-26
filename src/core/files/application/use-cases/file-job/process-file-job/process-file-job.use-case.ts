import { Injectable, Logger } from "@nestjs/common";
import { FileJob } from "src/core/files/domain/aggregate/file-job.aggregate";
import { FileJobRepository } from "src/core/files/domain/repositories/file-job.repository";
import { UseCase } from "src/core/shared/application/use-case.interface";
import { File } from "src/core/files/domain/aggregate/file.aggregate";
import { FileRepository } from "src/core/files/domain/repositories/file.repository";
import { ProcessFileJobInput } from "./process-file-job.input";
import { GenerateJobFileHashUseCase } from "../generate-job-file-hash/generate-job-file-hash.use-case";
import { LoggerProvider } from "src/core/shared/application/logger.interface";
import { EntityValidationError } from "src/core/shared/domain/errors/entity-validation.error";
import { FileJobType } from "src/core/files/domain/enums/file-job-type.enum";

@Injectable()
export class ProcessFileJobUseCase implements UseCase<ProcessFileJobInput, void> {
  constructor(
    private readonly fileJobRepository: FileJobRepository,
    private readonly fileRepository: FileRepository,
    private readonly generateJobFileHashUseCase: GenerateJobFileHashUseCase,
    private readonly logger: LoggerProvider
  ) { }

  async call({
    file,
    file_job
  }: ProcessFileJobInput) {
    try {
      file.toProcessing()

      const { hash_output } = await this.processFileHashAndOutput(file, file_job)

      const fileIsDuplicated = await this.fileRepository.findByHash(hash_output)
      if (fileIsDuplicated) {
        this.logger.warn({
          method: `${this.constructor.name}.call()`,
          message: `File ${file_job.file_id} is duplicate of File ${fileIsDuplicated.id}`,
          job_id: file_job.id!,
          file_id: file_job.file_id
        })

        file.isDuplicateOfFile(fileIsDuplicated.id!)
      } else {
        file.setHash(hash_output)

        await this.generateExtractDataJob(file_job.file_id)
      }

      file_job.toCompleted()

      await this.validateAndSave(file, file_job)

      this.logger.log({
        method: `${this.constructor.name}.call()`,
        message: 'Process File Job success',
        data: {
          file_job_id: file_job.id,
          file_id: file.id
        }
      })
    } catch (error) {
      await this.setJobToFailed(file_job)

      throw error
    }
  }

  async validateAndSave(file: File, file_job: FileJob) {
    if(file.hasErrors()) {
      throw new EntityValidationError(File, file.notification.toJSON())
    }

    if(file_job.hasErrors()) {
      throw new EntityValidationError(FileJob, file_job.notification.toJSON())
    }

    await Promise.all([
      this.fileRepository.save(file.toEntity()),
      this.fileJobRepository.save(file_job.toEntity())
    ])
  }

  async processFileHashAndOutput(file: File, file_job: FileJob): Promise<{
    hash_output: string,
  }> {
    const hashOutput = await this.generateJobFileHashUseCase.call({
      file_path: file.path,
      job_id: file_job.id!
    })

    return {
      hash_output: hashOutput.hash
    }
  }

  async generateExtractDataJob(file_id: number) {
    const job = FileJob.create({
      file_id,
      type: FileJobType.EXTRACT_DATA
    })

    if(job.hasErrors()) {
      this.logger.error({
        method: `${this.constructor.name}.generateExtractDataJob()`,
        message: 'Error while generating extract data job',
        error: JSON.stringify(job.notification.toJSON()),
        file_id
      })
      throw new EntityValidationError(FileJob, job.notification.toJSON())
    }

    this.logger.log({
      method: `${this.constructor.name}.generateExtractDataJob()`,
      message: 'Extract data job created successfully',
      job: JSON.stringify(job.toEntity()),
      file_id
    })

    await this.fileJobRepository.save(job.toEntity())
  }

  async setJobToFailed(file_job: FileJob) {
    if (!file_job) return

    file_job.toFailed()

    await this.fileJobRepository.save(file_job.toEntity())
  }
}