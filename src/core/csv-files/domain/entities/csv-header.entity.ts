import { FileEntity } from "src/core/files/domain/entities/file.entity"

export interface CsvHeaderEntity {
  id: number | undefined
  file?: FileEntity
  file_id: number
  name: string
  index: number
  created_at: Date
  updated_at: Date
  deleted_at: Date | undefined
}