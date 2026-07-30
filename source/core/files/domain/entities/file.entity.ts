import { FileStatusEnum } from "../enums/file-status.enum";

export interface FileEntity {
  id: number;
  name: string;
  original_name: string;
  status: FileStatusEnum;
  storage_path: string;
  size: number;
  mimetype: string;
  hash: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}