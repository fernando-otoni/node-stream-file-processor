import { FileEntity } from "src/core/files/domain/entities/file.entity"

export interface CsvRowEntity {
  id: number | undefined
  file?: FileEntity
  file_id: number
  data: string[]
  row: number
  created_at: Date
  updated_at: Date
  deleted_at: Date | undefined
}