import { Injectable, Logger } from "@nestjs/common";
import { FileJob } from "src/core/files/domain/aggregate/file-job.aggregate";
import { File } from "src/core/files/domain/aggregate/file.aggregate";
import { FileJobRepository } from "src/core/files/domain/repositories/file-job.repository";
import { UnitOfWork } from "src/core/shared/application/unit-of-work.interface";
import { UseCase } from "src/core/shared/application/use-case.interface";
import { EntityValidationError } from "src/core/shared/domain/errors/entity-validation.error";
import { ClaimNextPendingFileJobOutput } from "./claim-next-pending-file-job.output";
import { EntityNotFoundError } from "src/core/shared/domain/errors/entity-not-found.error";

@Injectable()
export class ClaimNextPendingFileUseCase implements UseCase<void, ClaimNextPendingFileJobOutput> {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly fileJobRepository: FileJobRepository
  ) {}

  file: File
  file_job: FileJob

  async call(): Promise<ClaimNextPendingFileJobOutput> {
    return await this.unitOfWork.runInTransaction(async () => {
      const fileJob = await this.fileJobRepository.getNextPendingFileJob()
      if(!fileJob || !fileJob.file) {
        return {
          file: undefined,
          file_job: undefined
        }
      }
      
      this.file_job = FileJob.createFromEntity(fileJob)
      if(this.file_job.hasErrors()) {
        await this.setJobToFailedAndSave()

        return {
          file: undefined,
          file_job: undefined
        }
      }

      this.file = File.createFromEntity(fileJob.file)
      if(this.file.hasErrors()) {
        throw new EntityValidationError(FileJob, this.file_job.notification.toJSON())
      }

      this.file_job.toProcessing()

      return {
        file: this.file,
        file_job: this.file_job
      }
    })
  }

  async setJobToFailedAndSave() {
    this.file_job.toFailed()
    this.file_job.setErrors([{ method: this.constructor.name }])

    await this.fileJobRepository.save(this.file_job.toEntity())

    Logger.error({
      method: `${this.constructor.name}.call()`,
      file_job: this.file_job.toEntity(),
      error: this.file_job.notification.toJSON()
    })
  }
}