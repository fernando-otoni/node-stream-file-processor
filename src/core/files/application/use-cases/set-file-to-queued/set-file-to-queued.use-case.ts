import { Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/core/shared/application/use-case.interface";
import { FileJob } from "src/core/files/domain/aggregate/file-job.aggregate";
import { FileJobRepository } from "src/core/files/domain/repositories/file-job.repository";
import { FileJobPersistenceMapper } from "src/core/files/infra/database/mapper/file-job-persistence.mapper";
import { EntityValidationError } from "src/core/shared/domain/errors/entity-validation.error";
import { FileRepository } from "src/core/files/domain/repositories/file.repository";
import { EntityNotFoundError } from "src/core/shared/domain/errors/entity-not-found.error";
import { File } from "src/core/files/domain/aggregate/file.aggregate";
import { EntityConflictError } from "src/core/shared/domain/errors/entity-conflict.error";
import { UnitOfWork } from "src/core/shared/application/unit-of-work.interface";

@Injectable()
export class SetFileToQueuedUseCase implements UseCase<void, void> {
  constructor(
    private readonly fileJobRepository: FileJobRepository,
    private readonly fileRepository: FileRepository,
    private readonly unitOfWork: UnitOfWork
  ) { }

  async call() {
    return this.unitOfWork.runInTransaction(async () => {
      const file = await this.loadFile()
      await this.validateFileJob(file)

      file.toQueued()

      if (file.hasErrors()) {
        throw new EntityValidationError(File, file.notification.toJSON())
      }

      await this.fileRepository.save(file.toEntity())

      const fileJob = await this.persistFileJob(file.id!)

      Logger.log({
        method: `${this.constructor.name}.call()`,
        message: `Job created successfully`,
        data: { file_id: file.id!, file_job_id: fileJob.id }
      })
    })
  }

  async loadFile(): Promise<File> {
    const file = await this.fileRepository.getNextPendingFile()
    if (!file) {
      throw new EntityNotFoundError(File)
    }

    const fileAggrete = new File(file)

    return fileAggrete
  }

  async validateFileJob(file: File) {
    const jobAlreadyExist = await this.fileJobRepository.getFileJobByFileId(file.id!)
    if (jobAlreadyExist) {
      throw new EntityConflictError(FileJob, jobAlreadyExist.id!)
    }
  }

  async persistFileJob(file_id: number) {
    const fileJob = FileJob.create({ file_id })

    if (fileJob.hasErrors()) {
      Logger.error({
        method: `${this.constructor.name}.call()`,
        errors: JSON.stringify(fileJob.notification.toJSON())
      })

      throw new EntityValidationError(FileJob, fileJob.notification.toJSON())
    }

    const fileJobtoPersistence = FileJobPersistenceMapper.toEntity(fileJob)

    const fileJobPersisted = await this.fileJobRepository.save(fileJobtoPersistence)

    fileJob.setId(fileJobPersisted.id!)

    return fileJob
  }
}