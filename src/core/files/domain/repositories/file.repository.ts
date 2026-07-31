import { FileEntity } from "../entities/file.entity";

export abstract class FileRepository {
  save: (file: FileEntity) => Promise<FileEntity>
}