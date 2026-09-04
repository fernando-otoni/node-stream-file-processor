import { FileJob } from "src/core/files/domain/aggregate/file-job.aggregate"
import { File } from "src/core/files/domain/aggregate/file.aggregate"

export interface ExtractDataFromXlsxFile {
  file: File
  file_job: FileJob
}