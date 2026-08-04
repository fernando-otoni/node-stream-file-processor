import { FileJobStatusEnum } from "../enums/file-job-status.enum"
import { FileEntity } from "./file.entity"

export interface FileJobEntity {
  id: number | null
  file_id: number
  status: FileJobStatusEnum
  attempts: number
  error?: Record<string, any>
  file?: FileEntity | null
  created_at: Date
  updated_at: Date
  finished_at: Date | null
  deleted_at: Date | null
}

