import { FileJobEntity } from "../entities/file-job.entity";
import { FileJobStatusEnum } from "../enums/file-job-status.enum";

export abstract class FileJobRepository {
  save: (input: Partial<FileJobEntity>) => Promise<FileJobEntity>
  update: (data: Partial<FileJobEntity>, id: number) => Promise<FileJobEntity>
  getFileJobByFileId: (file_id: number) => Promise<FileJobEntity | null>
  claimFileJobByStatus: (status: FileJobStatusEnum) => Promise<FileJobEntity | null>
}