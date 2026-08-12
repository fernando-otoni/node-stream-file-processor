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
import { ProcessFileJobInput } from "./process-file-job.input";

@Injectable()
export class ProcessFileJobUseCase implements UseCase<ProcessFileJobInput, void> {
  constructor(
    private readonly fileJobRepository: FileJobRepository,
    private readonly fileRepository: FileRepository,
    private readonly generateJobFileHashUseCase: GenerateJobFileHashUseCase
  ) { }

  fileAggregate: File
  fileJobAggregate: FileJob

  async call({
    file,
    file_job
  }: ProcessFileJobInput) {
    try {
      this.fileAggregate = file
      this.fileJobAggregate = file_job

      this.fileAggregate.toProcessing()
      this.fileJobAggregate.toProcessing()

      await this.processFileHashAndOutput()

      this.fileJobAggregate.toDone()

      await Promise.all([
        this.fileRepository.save(this.fileAggregate.toEntity()),
        this.fileJobRepository.save(this.fileJobAggregate.toEntity())
      ])

      Logger.log({
        method: `${this.constructor.name}.call()`,
        message: 'Process File Job success',
        data: {
          file_job_id: this.fileJobAggregate.id,
          file_id: this.fileAggregate.id
        }
      })
    } catch (error) {
      await this.setJobToFailed()

      throw error
    }
  }

  async processFileHashAndOutput() {
    const hashOutput = await this.generateJobFileHashUseCase.call({
      file_path: this.fileAggregate.path,
      job_id: this.fileJobAggregate.id!
    })

    const fileDuplicated = await this.fileRepository.findByHash(hashOutput.hash)
    if (fileDuplicated) {
      Logger.warn({
        method: `${this.constructor.name}.call()`,
        message: `File is duplicate of ${fileDuplicated.id}`
      })
      this.fileAggregate.isDuplicateOfFile(fileDuplicated.id!)
      this.fileAggregate.toDuplicate()
    } else {
      this.fileAggregate.setHash(hashOutput.hash)
      this.fileAggregate.toProcessed()
    }
  }

  async setJobToFailed() {
    if (!this.fileJobAggregate) return

    this.fileJobAggregate.toFailed()
    this.fileJobAggregate.incrementAttemps()

    await this.fileJobRepository.save(this.fileJobAggregate.toEntity())
  }

  async sleep(ms: number) {
    await new Promise(resolve => setTimeout(resolve, ms))
  }
}