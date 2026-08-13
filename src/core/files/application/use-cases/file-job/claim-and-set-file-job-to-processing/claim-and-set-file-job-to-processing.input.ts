import { FileJobStatusEnum } from "src/core/files/domain/enums/file-job-status.enum";

export interface ClaimAndSetFileJobToProcessingInput {
  status: FileJobStatusEnum
}