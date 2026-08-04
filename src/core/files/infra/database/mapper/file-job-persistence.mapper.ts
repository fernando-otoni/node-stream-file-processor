import { FileJob } from "src/core/files/domain/aggregate/file-job.aggregate";
import { FileJobEntity } from "src/core/files/domain/entities/file-job.entity";

export class FileJobPersistenceMapper {
  static toEntity(fileJob: FileJob): FileJobEntity {
    return {
      id: fileJob.id ?? null,
      file_id: fileJob.file_id,
      status: fileJob.status,
      attempts: fileJob.attempts,
      error: fileJob.error,
      created_at: fileJob.created_at,
      updated_at: fileJob.updated_at ?? null,
      finished_at: fileJob.finished_at ?? null,
      deleted_at: fileJob.deleted_at ?? null,
    }
  }
}