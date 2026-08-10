import { Injectable, Logger } from "@nestjs/common";
import { FileJob } from "src/core/files/domain/aggregate/file-job.aggregate";
import { FileJobRepository } from "src/core/files/domain/repositories/file-job.repository";
import { UnitOfWork } from "src/core/shared/application/unit-of-work.interface";
import { UseCase } from "src/core/shared/application/use-case.interface";
import { EntityNotFoundError } from "src/core/shared/domain/errors/entity-not-found.error";
import { EntityValidationError } from "src/core/shared/domain/errors/entity-validation.error";
import { GenerateJobFileHashUseCase } from "../generate-job-file-hash/generate-job-file-hash.use-case";
import { File } from "src/core/files/domain/aggregate/file.aggregate";
import { FileRepository } from "src/core/files/domain/repositories/file.repository";
import { FileEntity } from "src/core/files/domain/entities/file.entity";
import { FileJobEntity } from "src/core/files/domain/entities/file-job.entity";

@Injectable()
export class ProcessFileJobUseCase implements UseCase<void, void> {
  constructor(
    private readonly fileJobRepository: FileJobRepository,
    private readonly fileRepository: FileRepository,
    private readonly unitOfWork: UnitOfWork,
    private readonly generateJobFileHashUseCase: GenerateJobFileHashUseCase
  ) { }

  async call() {
    let file_job_entity: FileJobEntity | undefined = undefined

    try {
      return await this.unitOfWork.runInTransaction(async () => {
        const { file, file_job } = await this.loadNextFileAndFileJob()

        file_job_entity = file_job

        const fileAggregate = this.createFileAggregate(file)
        const fileJobAggregate = this.createFileJobAggregate(file_job)

        fileAggregate.toProcessing()
        fileJobAggregate.toProcessing()

        const hashOutput = await this.generateJobFileHashUseCase.call({
          file_path: fileAggregate.path,
          job_id: fileJobAggregate.id!
        })

        const fileDuplicated = await this.fileRepository.findByHash(hashOutput.hash)
        if (fileDuplicated) {
          Logger.warn({
            method: `${this.constructor.name}.call()`,
            message: `File is duplicate of ${fileDuplicated.id}`
          })
          fileAggregate.isDuplicateOfFile(fileDuplicated.id!)
          fileAggregate.toDuplicate()
        } else {
          fileAggregate.setHash(hashOutput.hash)
          fileAggregate.toProcessed()
        }

        fileJobAggregate.toDone()

        await Promise.all([
          this.fileRepository.save(fileAggregate.toEntity()),
          this.fileJobRepository.save(fileJobAggregate.toEntity())
        ])

        Logger.log({
          method: `${this.constructor.name}.call()`,
          message: 'Process File Job success',
          data: {
            file_job_id: fileJobAggregate.id,
            file_id: fileAggregate.id
          }
        })
      })
    } catch (error) {
      const message = error?.message

      if (file_job_entity) {
        Logger.error({
          method: `${this.constructor.name}.call()`,
          message: message ?? 'Unknown error while processing File Job',
          data: JSON.stringify(file_job_entity)
        })

        const fileJobAggregate = FileJob.createFromEntity(file_job_entity)

        fileJobAggregate.toFailed()
        fileJobAggregate.incrementAttemps()

        await this.fileJobRepository.save(fileJobAggregate.toEntity())
      }

      throw error
    }
  }

  async sleep(ms: number) {
    await new Promise(resolve => setTimeout(resolve, ms))
  }

  async loadNextFileAndFileJob() {
    const fileJob = await this.fileJobRepository.getNextPendingFileJob()
    if (!fileJob) {
      throw new EntityNotFoundError(FileJob)
    }

    if (!fileJob.file) {
      throw new EntityNotFoundError(File, fileJob.file_id)
    }

    Logger.log({
      method: `${this.constructor.name}.loadNextFileAndFileJob()`,
      file_job_id: fileJob.id
    })

    return {
      file_job: fileJob,
      file: fileJob.file
    }
  }

  createFileAggregate(fileInput: FileEntity) {
    const file = File.createFromEntity(fileInput)
    if (file.hasErrors()) {
      throw new EntityValidationError(File, file.notification.toJSON())
    }

    return file
  }

  createFileJobAggregate(fileJobInput: FileJobEntity) {
    const job = FileJob.createFromEntity(fileJobInput)
    if (job.hasErrors()) {
      throw new EntityValidationError(FileJob, job.notification.toJSON())
    }

    return job
  }

}