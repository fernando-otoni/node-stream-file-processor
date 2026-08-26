import { FileJobStatusEnum } from "src/core/files/domain/enums/file-job-status.enum";
import { FileJobType } from "src/core/files/domain/enums/file-job-type.enum";

export interface ClaimAndSetFileJobToProcessingInput {
  status: FileJobStatusEnum
  type: FileJobType
  file_mimetype?: string[]
}