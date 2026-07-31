import { UploadedFile } from "src/core/shared/domain/models/uploaded-file";

export class MulterFileMapper {
  static toUploadedFile(input: Express.Multer.File): UploadedFile {
    return {
      field_name: input.fieldname,
      original_name: input.originalname,
      encoding: input.encoding,
      mimetype: input.mimetype,
      path: input.path,
      destination: input.destination,
      file_name: input.filename,
      size: input.size,
    }
  }
}