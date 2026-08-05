import { FileEntity } from "../entities/file.entity";

export abstract class FileRepository {
  save: (file: FileEntity) => Promise<FileEntity>
  getNextPendingFile: () => Promise<FileEntity | null>
  findById: (id: number) => Promise<FileEntity | null>
}