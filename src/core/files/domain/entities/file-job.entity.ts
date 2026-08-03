import { FileJobStatusEnum } from "../enums/file-job-status.enum"
import { FileEntity } from "./file.entity"

export interface FileJobEntity {
  id: number
  file_id: number
  status: FileJobStatusEnum
  attempts: number
  error?: Record<string, any>
  file: FileEntity
  created_at: Date
  updated_at: Date
  finished_at: Date
  deleted_at: Date | null
}

