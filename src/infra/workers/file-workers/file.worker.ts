import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { JobQueue } from "src/infra/queue/job.queue";
import { UploadRepository } from "src/modules/upload/infra/database/repository/upload.repository";
import { UploadStatusEnum } from "src/modules/upload/infra/database/entity/upload.entity";
import { JobRepository } from "../../queue/database/job.repository";
import { JobStatusEnum } from "../../queue/entity/job.entity";
import { UploadSuccessInput } from "../dto/upload-success.input";
import { FileProcessor } from "src/infra/processor/file.processor";
import { JobFileDto } from "src/infra/queue/job-file-processor.interface";

@Injectable()
export class FileWorker implements OnModuleInit {
  constructor(
    private readonly fileProcessor: FileProcessor,
    private readonly queue: JobQueue,
    private readonly uploadRepository: UploadRepository,
    private readonly jobRepository: JobRepository
  ) { }

  onModuleInit() {
    this.start()
  }

  async start() {
    while(true) {
      const job = await this.queue.getNextJob()

      if (!job) {
        await this.sleep(1000)
        continue
      }

      await this.startProcessingFile(job)
    }
  }

  async startProcessingFile({
    jobId, path, originalName, mimetype, size
  }: JobFileDto) {
    const uploadPersisted = await this.uploadRepository.create({
      original_name: originalName,
      size,
      status: UploadStatusEnum.PROCESSING,
      mimetype
    })

    try {

    const data: any = {}
    data.clear()
      const processInfo = await this.fileProcessor.call(path)

      const fileAlreadyProcessed = await this.uploadRepository.findByHash(processInfo.hash)
      if (fileAlreadyProcessed) {
        Logger.warn(`File already uploaded, File conflicted with the file with ID: ${fileAlreadyProcessed.id}`, 'Job')

        await this.cancelUpload({ uploadId: uploadPersisted.id, jobId })
        return 
      }

      Logger.log(`HASH: ${processInfo.hash}`, 'Job')
      await this.uploadSuccess({
        jobId,
        uploadId: uploadPersisted.id,
        uploadInfos: processInfo
      })
    } catch (error) {
      Logger.error(`Error while trying to process file ${uploadPersisted.id}`, 'Job')
      await this.uploadFailed({ jobId: jobId, uploadId: uploadPersisted.id})
    }
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private async cancelUpload(data: { uploadId: number, jobId: number }) {
    await Promise.all([
      this.uploadRepository.update({
        status: UploadStatusEnum.CANCELLED
      }, data.uploadId),
      this.jobRepository.update({
        status: JobStatusEnum.CANCELLED,
        finished_at: new Date()
      }, data.jobId)
    ])
  }

  private async uploadFailed(data: { uploadId: number, jobId: number }) {
    await Promise.all([
      this.uploadRepository.update({
        status: UploadStatusEnum.FAILED,
      }, data.uploadId),
      this.jobRepository.update({
        status: JobStatusEnum.FAILED,
        finished_at: new Date()
      }, data.jobId)
    ])
  }

  private async uploadSuccess(data: UploadSuccessInput) {
    const { jobId, uploadId, uploadInfos } = data
    const { hash, filename, storagePath } = uploadInfos

    await Promise.all([
      this.uploadRepository.update({
        hash,
        status: UploadStatusEnum.HASHED,
        name: filename,
        storage_path: storagePath,
      }, uploadId),
      this.jobRepository.update({
        status: JobStatusEnum.DONE,
        finished_at: new Date()
      }, jobId)
    ])
  }
}