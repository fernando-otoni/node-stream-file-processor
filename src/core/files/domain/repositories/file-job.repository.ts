import { FileJobEntity } from "../entities/file-job.entity";
import { FileJobStatusEnum } from "../enums/file-job-status.enum";
import { FileJobType } from "../enums/file-job-type.enum";

export interface ClaimQuery {
  status: FileJobStatusEnum
  type: FileJobType
  file_mimetype?: string[]
}

export abstract class FileJobRepository {
  save: (input: Partial<FileJobEntity>) => Promise<FileJobEntity>
  update: (data: Partial<FileJobEntity>, id: number) => Promise<FileJobEntity>
  getFileJobByFileId: (file_id: number) => Promise<FileJobEntity | null>
  claimFileJobByStatus: (query: ClaimQuery) => Promise<FileJobEntity | null>
}