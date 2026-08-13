import { UploadedFile } from "src/core/shared/domain/models/uploaded-file";

export interface SaveFileUseCaseInput {
  uploaded_file: UploadedFile
}