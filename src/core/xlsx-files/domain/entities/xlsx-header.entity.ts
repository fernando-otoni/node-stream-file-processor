import { FileEntity } from "src/core/files/domain/entities/file.entity"

export interface XlsxHeaderEntity {
  id: number | undefined
  name: string
  position_index: number
  worksheet_index: number
  file?: FileEntity
  file_id: number
  created_at: Date
  updated_at: Date
  deleted_at: Date | undefined
}