import { File } from "src/core/files/domain/aggregate/file.aggregate";
import { FileEntity } from "src/core/files/domain/entities/file.entity";

export class FilePersistenceMapper {
  static toEntity(file: File): FileEntity {
    return {
      id: file.id,
      field_name: file.field_name,
      original_name: file.original_name,
      encoding: file.encoding,
      mimetype: file.mimetype,
      path: file.path,
      destination: file.destination,
      file_name: file.file_name,
      size: file.size,
      hash: file.hash,
      status: file.status,
      created_at: file.created_at,
      updated_at: file.updated_at,
      deleted_at: file.deleted_at,
    }
  }
}