import { FileEntity } from "src/core/files/domain/entities/file.entity"

export type XlsxRowData = (string | number)[];

export interface XlsxRowEntity {
  id: number | undefined
  file?: FileEntity
  file_id: number
  worksheet_index: number
  data: XlsxRowData
  row: number
  created_at: Date
  updated_at: Date
  deleted_at: Date | undefined
}