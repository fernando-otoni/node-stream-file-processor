import { FileJobEntity } from "../entities/file-job.entity";
import { PaginatedResult } from "src/core/shared/domain/repositories/paginated-result.interface";

export interface FileJobRepository {
  create: (input: Partial<FileJobEntity>) => Promise<FileJobEntity>
  update: (data: Partial<FileJobEntity>, id: number) => Promise<FileJobEntity>
  getPendingJobs: () => Promise<PaginatedResult<FileJobEntity>>
}