import { UseCase } from "src/core/shared/application/use-case.interface";
import { ClaimAndSetFileJobToProcessingOutput } from "./claim-and-set-file-job-to-processing.output";
import { UnitOfWork } from "src/core/shared/application/unit-of-work.interface";
import { FileJobRepository } from "src/core/files/domain/repositories/file-job.repository";
import { Injectable, Logger } from "@nestjs/common";
import { File } from "src/core/files/domain/aggregate/file.aggregate";
import { FileJob } from "src/core/files/domain/aggregate/file-job.aggregate";
import { EntityValidationError } from "src/core/shared/domain/errors/entity-validation.error";
import { FileEntity } from "src/core/files/domain/entities/file.entity";
import { FileJobEntity } from "src/core/files/domain/entities/file-job.entity";
import { EntityNotFoundError } from "src/core/shared/domain/errors/entity-not-found.error";
import { ClaimAndSetFileJobToProcessingInput } from "./claim-and-set-file-job-to-processing.input";
import { FileJobStatusEnum } from "src/core/files/domain/enums/file-job-status.enum";
import { LoggerProvider } from "src/core/shared/application/logger.interface";

@Injectable()
export default class ClaimAndSetFileJobToProcessingUseCase 
  implements UseCase<
    ClaimAndSetFileJobToProcessingInput, 
    ClaimAndSetFileJobToProcessingOutput
> {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly fileJobRepository: FileJobRepository,
    private readonly logger: LoggerProvider
  ) {}

  async call({ status }: ClaimAndSetFileJobToProcessingInput) {
    let file_job_aggregate: FileJob | undefined
    let file_aggregate: File | undefined

    try {
      return await this.unitOfWork.runInTransaction(async () => {
        const { file_job, file } = await this.getNextJob(status)
  
        file_job_aggregate = await this.loadFileJobFromEntity(file_job)
        file_aggregate = await this.loadFileFromEntity(file)

        file_job_aggregate.toProcessing()
  
        await this.persistFileJob(file_job_aggregate)
  
        return {
          file: file_aggregate,
          file_job: file_job_aggregate
        }
      })
    } catch (error) {
      const errorMessage = error?.message 

      await this.trySetJobToFailedAndSave(file_job_aggregate, errorMessage)

      throw error
    }
  }

  async getNextJob(status: FileJobStatusEnum) {
    const fileJob = await this.fileJobRepository.claimFileJobByStatus(status)
    if(!fileJob) {
      throw new EntityNotFoundError(FileJob)
    }

    if(!fileJob.file) {
      throw new EntityNotFoundError(File)
    }

    return { 
      file_job: fileJob,
      file: fileJob.file
    }
  }

  async loadFileJobFromEntity(file_job: FileJobEntity) {
    const fileJob = FileJob.createFromEntity(file_job)
    if(fileJob.hasErrors()) {
      throw new EntityValidationError(FileJob, fileJob.notification.toJSON())
    }

    return fileJob
  }

  async loadFileFromEntity(file: FileEntity) {
    const fileAggregate = File.createFromEntity(file)
    if(fileAggregate.hasErrors()) {
      throw new EntityValidationError(FileJob, fileAggregate.notification.toJSON())
    }

    return fileAggregate
  }

  async persistFileJob(file_job: FileJob) {
    if(file_job.hasErrors()) {
      this.logger.log({
        method: `${this.constructor.name}.call()`,
        file_job: JSON.stringify(file_job),
        errors: file_job.notification.toJSON()
      })
      throw new EntityValidationError(FileJob, file_job.notification.toJSON())
    }

    await this.fileJobRepository.save(file_job.toEntity())
  }

  async trySetJobToFailedAndSave(file_job: FileJob | undefined, error_message?: string) {
    if(!file_job) return

    file_job.toFailed()
    file_job.setErrors([
      { method: this.constructor.name },
      ...(error_message ? [{ error_message }] : [])
    ])

    await this.fileJobRepository.save(file_job.toEntity())

    this.logger.error({
      method: `${this.constructor.name}.call()`,
      file_job: file_job.toEntity(),
      error: file_job.notification.toJSON()
    })
  }
}