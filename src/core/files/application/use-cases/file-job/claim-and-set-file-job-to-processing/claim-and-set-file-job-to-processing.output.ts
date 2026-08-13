import { FileJob } from "src/core/files/domain/aggregate/file-job.aggregate"
import { File } from "src/core/files/domain/aggregate/file.aggregate"

export interface ClaimAndSetFileJobToProcessingOutput {
  file_job: FileJob | undefined
  file: File | undefined
}