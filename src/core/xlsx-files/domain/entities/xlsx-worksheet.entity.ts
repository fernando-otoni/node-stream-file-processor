export interface XlsxWorksheetEntity {
  id: number | undefined
  name: string
  index: number
  file_id: number
  created_at: Date
  updated_at: Date
  deleted_at: Date | undefined
}