import { Injectable, Logger } from "@nestjs/common";
import { FileJob } from "src/core/files/domain/aggregate/file-job.aggregate";
import { FileJobRepository } from "src/core/files/domain/repositories/file-job.repository";
import { UseCase } from "src/core/shared/application/use-case.interface";
import { File } from "src/core/files/domain/aggregate/file.aggregate";
import { FileRepository } from "src/core/files/domain/repositories/file.repository";
import { ProcessFileJobInput } from "./process-file-job.input";
import { GenerateJobFileHashUseCase } from "../generate-job-file-hash/generate-job-file-hash.use-case";

@Injectable()
export class ProcessFileJobUseCase implements UseCase<ProcessFileJobInput, void> {
  constructor(
    private readonly fileJobRepository: FileJobRepository,
    private readonly fileRepository: FileRepository,
    private readonly generateJobFileHashUseCase: GenerateJobFileHashUseCase
  ) { }

  async call({
    file,
    file_job
  }: ProcessFileJobInput) {
    try {
      file.toProcessing()

      await this.processFileHashAndOutput(file, file_job)

      file_job.toDone()

      await Promise.all([
        this.fileRepository.save(file.toEntity()),
        this.fileJobRepository.save(file_job.toEntity())
      ])

      Logger.log({
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

  async processFileHashAndOutput(file: File, file_job: FileJob) {
    const hashOutput = await this.generateJobFileHashUseCase.call({
      file_path: file.path,
      job_id: file_job.id!
    })

    const fileDuplicated = await this.fileRepository.findByHash(hashOutput.hash)
    if (fileDuplicated) {
      Logger.warn({
        method: `${this.constructor.name}.call()`,
        message: `File is duplicate of ${fileDuplicated.id}`
      })
      file.isDuplicateOfFile(fileDuplicated.id!)
    } else {
      file.setHash(hashOutput.hash)
    }
  }

  async setJobToFailed(file_job: FileJob) {
    if (!file_job) return

    file_job.toFailed()

    await this.fileJobRepository.save(file_job.toEntity())
  }
}