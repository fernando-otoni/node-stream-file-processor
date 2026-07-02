import { ProcessUploadOutput } from "./process-upload.output"

export interface UploadSuccessInput {
  jobId: number
  uploadId: number
  uploadInfos: ProcessUploadOutput
}