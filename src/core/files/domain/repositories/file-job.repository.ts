import { FileJobEntity } from "../entities/file-job.entity";
import { PaginatedResult } from "src/core/shared/domain/repositories/paginated-result.interface";

export abstract class FileJobRepository {
  save: (input: Partial<FileJobEntity>) => Promise<FileJobEntity>
  update: (data: Partial<FileJobEntity>, id: number) => Promise<FileJobEntity>
  getFileJobByFileId: (file_id: number) => Promise<FileJobEntity | null>
  getNextPendingFileJob: () => Promise<FileJobEntity | null>
}